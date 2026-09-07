import { atomWithStorage } from "jotai/utils";

export const sidebarOpenAtom = atomWithStorage("sidebar-open", true, undefined, {
  getOnInit: true,
});
