import { useMemo } from "react";
import type { Permission } from "@/features/permission/types";
import { Checkbox } from "@/shared/components/ui/checkbox";

type PermissionSelectorProps = {
  permissions: Permission[];
  value: string[];
  onChange: (value: string[]) => void;
  loading?: boolean;
};

export function PermissionSelector({
  permissions,
  value,
  onChange,
  loading,
}: PermissionSelectorProps) {
  const selectedIds = useMemo(() => new Set(value), [value]);

  const groupedPermissions = useMemo(() => {
    const groups = new Map<string, Permission[]>();

    for (const permission of permissions) {
      const existing = groups.get(permission.resource);

      if (existing) {
        existing.push(permission);
      } else {
        groups.set(permission.resource, [permission]);
      }
    }

    return Array.from(groups.entries());
  }, [permissions]);

  const togglePermission = (permissionId: string) => {
    const next = new Set(selectedIds);

    if (next.has(permissionId)) {
      next.delete(permissionId);
    } else {
      next.add(permissionId);
    }

    onChange(Array.from(next));
  };

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading permissions...
      </div>
    );
  }

  if (permissions.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No permissions available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="font-medium text-sm">Choose Permissions</div>

      {groupedPermissions.map(([resource, permissions]) => (
        <div key={resource} className="space-y-2">
          <div className="text-sm font-medium capitalize">{resource}</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {permissions.map((permission) => {
              const checked = selectedIds.has(permission.id);

              return (
                <label
                  key={permission.id}
                  className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => togglePermission(permission.id)}
                  />

                  <div className="space-y-1">
                    <div className="text-sm font-medium leading-none">
                      {permission.name}
                    </div>

                    {permission.description && (
                      <div className="text-xs text-muted-foreground">
                        {permission.description}
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
