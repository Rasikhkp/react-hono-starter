import { atom } from "jotai";
import type { User } from "../types";

export const selectedUserAtom = atom<User>();
