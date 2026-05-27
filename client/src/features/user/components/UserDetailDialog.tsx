import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Check } from "lucide-react";
import type { Permission } from "@/features/permission/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { api } from "@/shared/lib/api";
import { selectedUserAtom } from "../atoms/selectedUserAtom";
import { viewDialogOpenAtom } from "../atoms/viewDialogOpenAtom";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UserDetailDialog() {
  const [open, setOpen] = useAtom(viewDialogOpenAtom);
  const [user] = useAtom(selectedUserAtom);

  const userPermissionsQuery = useQuery({
    queryKey: ["user-permissions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const res = await api.get("roles", { credentials: "include" }).json<
        {
          data: Array<{
            id: string;
            name: string;
            permissions: Permission[];
          }> | null;
        } & { error?: unknown }
      >();
      const roles = res.data ?? [];
      const userRoleIdsSet = new Set(user.roles.map((r) => r.id));
      const perms = new Map<string, Permission>();
      for (const role of roles) {
        if (userRoleIdsSet.has(role.id)) {
          for (const perm of role.permissions) {
            perms.set(perm.id, perm);
          }
        }
      }
      return Array.from(perms.values());
    },
    enabled: open && !!user,
  });

  const userPermissions = userPermissionsQuery.data ?? [];

  const permissionsByResource = new Map<string, Permission[]>();
  for (const perm of userPermissions) {
    if (!permissionsByResource.has(perm.resource)) {
      permissionsByResource.set(perm.resource, []);
    }
    permissionsByResource.get(perm.resource)?.push(perm);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPopup className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View user information, roles, and permissions.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="grid gap-6">
          {user && (
            <>
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <Avatar size="lg">
                  <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="font-semibold text-lg truncate">
                    {user.name}
                  </div>
                  <div className="text-muted-foreground text-sm truncate">
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-block size-2 rounded-full ${
                      user.isActive ? "bg-emerald-500" : "bg-gray-400"
                    }`}
                  />
                  <span className="text-muted-foreground">
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-block size-2 rounded-full ${
                      user.isEmailVerified ? "bg-blue-500" : "bg-gray-400"
                    }`}
                  />
                  <span className="text-muted-foreground">
                    {user.isEmailVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>

              {/* Roles */}
              <div>
                <div className="text-sm font-medium mb-2">Roles</div>
                {user.roles.length === 0 ? (
                  <span className="text-muted-foreground text-sm">
                    No roles assigned
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role) => (
                      <div
                        key={role.id}
                        className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                      >
                        {role.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Permissions */}
              <div>
                <div className="text-sm font-medium mb-2">Permissions</div>
                {userPermissions.length === 0 ? (
                  <span className="text-muted-foreground text-sm">
                    No permissions
                  </span>
                ) : (
                  <div className="rounded-xl border bg-card/50 p-4 space-y-4">
                    {Array.from(permissionsByResource.entries()).map(
                      ([resource, perms]) => (
                        <div key={resource}>
                          <div className="text-sm font-semibold mb-1.5 capitalize">
                            {resource}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                            {perms.map((perm) => (
                              <div
                                key={perm.id}
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                              >
                                <Check className="size-3.5 text-emerald-500 shrink-0" />
                                <span>{perm.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogPanel>
        <DialogFooter variant="bare">
          <DialogClose render={<Button variant="ghost" />}>Close</DialogClose>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
