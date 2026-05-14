import { SignJWT, jwtVerify } from "jose";
import { env } from "../config/env";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export async function signAccessToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(secret);
}

export async function verifyAccessToken(token: string) {
  return await jwtVerify(token, secret);
}
