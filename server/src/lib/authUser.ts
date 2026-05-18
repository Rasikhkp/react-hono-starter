import { sql } from "kysely";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  isActive: number | null;
  isEmailVerified: number | null;
  googleSub: string | null;
  hasPassword: boolean;
};

/** Safe session user fields (omit password hash). Include `hasPassword` via SQL. */
export const authUserFields = [
  "id",
  "name",
  "email",
  "isActive",
  "isEmailVerified",
  "googleSub",
  sql<number>`IF(password IS NULL, 0, 1)`.as("hasPassword"),
] as const;

export type AuthUserRow = {
  id: string;
  name: string;
  email: string;
  isActive: number | null;
  isEmailVerified: number | null;
  googleSub: string | null;
  hasPassword: number;
};

export function toAuthUser(row: AuthUserRow): AuthUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    isActive: row.isActive,
    isEmailVerified: row.isEmailVerified,
    googleSub: row.googleSub ?? null,
    hasPassword: row.hasPassword === 1,
  };
}
