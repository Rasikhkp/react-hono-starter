import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CreatePermissionDialog } from "@/features/permission/components/CreatePermissionDialog";
import { DeletePermissionDialog } from "@/features/permission/components/DeletePermissionDialog";
import { EditPermissionDialog } from "@/features/permission/components/EditPermissionDialog";
import { PermissionCard } from "@/features/permission/components/PermissionCard";
import type { Permission } from "@/features/permission/types";
import { toastManager } from "@/shared/components/ui/toast";
import { usePermission } from "@/shared/hooks/usePermission";
import { useUpdateBreadcrumbs } from "@/shared/hooks/useUpdateBreadcrumbs";
import { api } from "@/shared/lib/api";
import { parseSafeError } from "@/shared/lib/error";

export const Route = createFileRoute("/admin/permissions")({
  component: RouteComponent,
});

function RouteComponent() {
  useUpdateBreadcrumbs([
    { name: "Home", url: "/admin" },
    { name: "Permissions", url: "/admin/permissions" },
  ]);

  const { hasPermission } = usePermission();

  const query = useQuery({
    queryKey: ["permissions"],
    queryFn: () =>
      api
        .get("permissions", { credentials: "include" })
        .json<{ data: Permission[] | null; error: unknown | null }>(),
  });

  if (query.isError) {
    toastManager.add({
      type: "error",
      description: parseSafeError(query.error).message,
      title: "Error occurred",
    });
  }

  const permissions = query.data?.data ?? [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-5">
        <div className="text-3xl font-bold">Permission Management</div>
        {hasPermission("permissions:create") && <CreatePermissionDialog />}
      </div>

      {query.isLoading ? (
        <div className="text-muted-foreground">Loading permissions...</div>
      ) : permissions.length === 0 ? (
        <div className="text-muted-foreground">No permissions found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {permissions.map((permission) => (
            <PermissionCard
              key={permission.id}
              permission={permission}
              canEdit={hasPermission("permissions:update")}
              canDelete={hasPermission("permissions:delete")}
            />
          ))}
        </div>
      )}

      <EditPermissionDialog />
      <DeletePermissionDialog />
    </div>
  );
}
