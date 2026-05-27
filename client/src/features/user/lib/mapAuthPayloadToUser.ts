import type { User } from "../types";

/** Normalizes `/me` or auth-related API payloads to the client `User` shape. */
export function mapAuthPayloadToUser(data: {
  id: string;
  name: string;
  email: string;
  isActive?: number | null | boolean;
  isEmailVerified?: number | null | boolean;
  googleSub?: string | null;
  hasPassword?: boolean;
  avatar?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  roles?: { id: string; name: string }[];
  permissions?: { id: string; name: string; resource: string }[];
}): User {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    isActive: Boolean(data.isActive),
    isEmailVerified: Boolean(data.isEmailVerified),
    googleSub: data.googleSub ?? null,
    hasPassword: Boolean(data.hasPassword),
    avatar: data.avatar ?? null,
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
    roles: data.roles ?? [],
    permissions: data.permissions ?? [],
  };
}
