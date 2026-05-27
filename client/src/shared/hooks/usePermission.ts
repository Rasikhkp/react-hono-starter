import { useAtomValue } from "jotai";
import { authAtom } from "@/shared/atoms/authAtom";

export function usePermission() {
  const auth = useAtomValue(authAtom);

  const permissions = auth?.permissions ?? [];
  const permissionNames = new Set(permissions.map((p) => p.name));

  const hasPermission = (permission: string) => {
    return permissionNames.has(permission);
  };

  const hasAnyPermission = (...perms: string[]) => {
    return perms.some((p) => permissionNames.has(p));
  };

  return { hasPermission, hasAnyPermission, permissions };
}
