import { atom } from "jotai";
import type { User } from "@/features/users/types";

export const authAtom = atom<User | null | undefined>();
