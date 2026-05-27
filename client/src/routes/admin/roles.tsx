import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CreateRoleDialog } from "@/features/role/components/CreateRoleDialog";
import { DeleteRoleDialog } from "@/features/role/components/DeleteRoleDialog";
import { EditRoleDialog } from "@/features/role/components/EditRoleDialog";
import { RoleCard } from "@/features/role/components/RoleCard";
import type { Role } from "@/features/role/types";
import { toastManager } from "@/shared/components/ui/toast";
import { usePermission } from "@/shared/hooks/usePermission";
import { useUpdateBreadcrumbs } from "@/shared/hooks/useUpdateBreadcrumbs";
import { api } from "@/shared/lib/api";
import { parseSafeError } from "@/shared/lib/error";

export const Route = createFileRoute("/admin/roles")({
  component: RouteComponent,
});

function RouteComponent() {
  useUpdateBreadcrumbs([
    { name: "Home", url: "/admin" },
    { name: "Roles", url: "/admin/roles" },
  ]);

  const { hasPermission } = usePermission();

  const query = useQuery({
    queryKey: ["roles"],
    queryFn: () =>
      api
        .get("roles", { credentials: "include" })
        .json<{ data: Role[] | null; error: unknown | null }>(),
  });

  if (query.isError) {
    toastManager.add({
      type: "error",
      description: parseSafeError(query.error).message,
      title: "Error occurred",
    });
  }

  const roles = query.data?.data ?? [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-5">
        <div className="text-3xl font-bold">Role Management</div>
        {hasPermission("roles:create") && <CreateRoleDialog />}
      </div>

      {query.isLoading ? (
        <div className="text-muted-foreground">Loading roles...</div>
      ) : roles.length === 0 ? (
        <div className="text-muted-foreground">No roles found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              canEdit={hasPermission("roles:update")}
              canDelete={hasPermission("roles:delete")}
            />
          ))}
        </div>
      )}

      <EditRoleDialog />
      <DeleteRoleDialog />
    </div>
  );
}
