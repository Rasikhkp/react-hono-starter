import { atom } from "jotai";
import type { Role } from "../types";

export const selectedRoleAtom = atom<Role | undefined>(undefined);
