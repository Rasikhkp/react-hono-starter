import { atom } from "jotai";
import type { User } from "@/features/user/types";

export const authAtom = atom<User | null | undefined>();
