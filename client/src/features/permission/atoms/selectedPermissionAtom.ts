import { atom } from "jotai";
import type { Permission } from "../types";

export const selectedPermissionAtom = atom<Permission | undefined>(undefined);
