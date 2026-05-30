import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CreatePermissionDialog } from "@/features/permission/components/CreatePermissionDialog";
import { DeletePermissionDialog } from "@/features/permission/components/DeletePermissionDialog";
import { EditPermissionDialog } from "@/features/permission/components/EditPermissionDialog";
import { ResourcePermissionsPanel } from "@/features/permission/components/ResourcePermissionsPanel";
import { ResourceSidebar } from "@/features/permission/components/ResourceSidebar";
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

  const resources = useMemo(
    () => [...new Set(permissions.map((p) => p.resource))].sort(),
    [permissions],
  );

  const [selectedResource, setSelectedResource] = useState(resources[0] ?? "");

  const filteredPermissions = permissions.filter(
    (p) => p.resource === selectedResource,
  );

  useEffect(() => {
    if (resources.length) {
      setSelectedResource(resources[0]);
    }
  }, [resources]);

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
        <div className="flex flex-col gap-6 md:flex-row">
          <ResourceSidebar
            resources={resources}
            selectedResource={selectedResource}
            onSelect={setSelectedResource}
          />
          <ResourcePermissionsPanel
            resource={selectedResource}
            permissions={filteredPermissions}
            canEdit={hasPermission("permissions:update")}
            canDelete={hasPermission("permissions:delete")}
          />
        </div>
      )}

      <EditPermissionDialog />
      <DeletePermissionDialog />
    </div>
  );
}
