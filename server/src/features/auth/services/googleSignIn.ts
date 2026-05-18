import { OAuth2Client } from "google-auth-library";
import { v7 } from "uuid";
import { db } from "@/db/database";
import { env } from "@/config/env";
import { AppError, ERROR_TYPES } from "@/lib/error";
import { createAuthSession } from "./createAuthSession";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export const signInWithGoogle = async (code: string) => {
  const oauth2Client = new OAuth2Client({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: env.GOOGLE_REDIRECT_URI,
  });

  let tokens;
  try {
    ({ tokens } = await oauth2Client.getToken({ code }));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("redirect_uri_mismatch")) {
      throw new AppError(
        ERROR_TYPES.VALIDATION_ERROR,
        `Google redirect_uri_mismatch: GOOGLE_REDIRECT_URI must match your SPA origin and Google Console Authorized redirect URIs (currently ${env.GOOGLE_REDIRECT_URI}).`,
        400,
      );
    }

    throw new AppError(
      ERROR_TYPES.UNAUTHORIZED,
      "Failed to exchange Google authorization code",
      401,
    );
  }

  if (!tokens.id_token) {
    throw new AppError(
      ERROR_TYPES.UNAUTHORIZED,
      "Missing Google ID token after code exchange",
      401,
    );
  }

  const idToken = tokens.id_token;

  let ticket;
  try {
    ticket = await oauth2Client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
  } catch {
    throw new AppError(
      ERROR_TYPES.UNAUTHORIZED,
      "Invalid Google credential",
      401,
    );
  }

  const payload = ticket.getPayload();
  const sub = payload?.sub;
  const emailRaw = payload?.email;
  const name = payload?.name?.trim() || emailRaw?.split("@")[0] || "User";

  if (!sub || !emailRaw) {
    throw new AppError(
      ERROR_TYPES.VALIDATION_ERROR,
      "Google account is missing required profile information",
      400,
    );
  }

  const email = normalizeEmail(emailRaw);
  const emailVerified = Boolean(payload.email_verified);

  const byGoogle = await db
    .selectFrom("users")
    .select("id")
    .where("googleSub", "=", sub)
    .executeTakeFirst();

  if (byGoogle) {
    await db
      .updateTable("users")
      .set({
        name,
        isEmailVerified: emailVerified ? 1 : 0,
      })
      .where("id", "=", byGoogle.id)
      .execute();

    return createAuthSession(byGoogle.id);
  }

  const byEmail = await db
    .selectFrom("users")
    .select(["id", "googleSub"])
    .where(({ eb }) =>
      eb(eb.fn<string>("lower", [eb.fn<string>("trim", [eb.ref("email")])]), "=", email),
    )
    .executeTakeFirst();

  if (byEmail) {
    if (byEmail.googleSub && byEmail.googleSub !== sub) {
      throw new AppError(
        ERROR_TYPES.CONFLICT,
        "This email is already linked to a different Google account",
        409,
      );
    }

    if (!emailVerified) {
      throw new AppError(
        ERROR_TYPES.VALIDATION_ERROR,
        "Verify your email with Google before signing in with Google for this account",
        400,
      );
    }

    await db
      .updateTable("users")
      .set({
        googleSub: sub,
        name,
        isEmailVerified: 1,
      })
      .where("id", "=", byEmail.id)
      .execute();

    return createAuthSession(byEmail.id);
  }

  const userId = v7();

  await db
    .insertInto("users")
    .values({
      id: userId,
      email,
      name,
      password: null,
      googleSub: sub,
      isActive: 1,
      isEmailVerified: emailVerified ? 1 : 0,
    })
    .execute();

  return createAuthSession(userId);
};
