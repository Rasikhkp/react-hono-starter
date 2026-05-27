import { sql } from "kysely";

export type PermissionInfo = {
  id: string;
  name: string;
  resource: string;
};

export type RoleInfo = {
  id: string;
  name: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  isActive: number | null;
  isEmailVerified: number | null;
  googleSub: string | null;
  hasPassword: boolean;
  avatar: string | null;
  roles: RoleInfo[];
  permissions: PermissionInfo[];
};

/** Safe session user fields (omit password hash). Include `hasPassword` via SQL. */
export const authUserFields = [
  "id",
  "name",
  "email",
  "isActive",
  "isEmailVerified",
  "googleSub",
  "avatar",
  sql<number>`IF(password IS NULL, 0, 1)`.as("hasPassword"),
] as const;

export type AuthUserRow = {
  id: string;
  name: string;
  email: string;
  isActive: number | null;
  isEmailVerified: number | null;
  googleSub: string | null;
  avatar: string | null;
  hasPassword: number;
};

export function toAuthUser(
  row: AuthUserRow,
  roles: RoleInfo[],
  permissions: PermissionInfo[],
): AuthUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    isActive: row.isActive,
    isEmailVerified: row.isEmailVerified,
    googleSub: row.googleSub ?? null,
    avatar: row.avatar ?? null,
    hasPassword: row.hasPassword === 1,
    roles,
    permissions,
  };
}
