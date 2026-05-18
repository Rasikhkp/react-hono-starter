import type { User } from "../types";

/** Normalizes `/me` or auth-related API payloads to the client `User` shape. */
export function mapAuthPayloadToUser(data: {
  id: string;
  name: string;
  email: string;
  isActive?: number | null | boolean;
  isEmailVerified?: number | null | boolean;
  googleSub?: string | null;
  /** Omitted by some payloads; normalized to booleans elsewhere. */
  hasPassword?: boolean;
}): User {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    isActive: Boolean(data.isActive),
    isEmailVerified: Boolean(data.isEmailVerified),
    googleSub: data.googleSub ?? null,
    hasPassword: Boolean(data.hasPassword),
  };
}
