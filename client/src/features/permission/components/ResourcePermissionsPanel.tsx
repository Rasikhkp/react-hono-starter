import { useSetAtom } from "jotai";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { deleteDialogOpenAtom } from "../atoms/deleteDialogOpenAtom";
import { editDialogOpenAtom } from "../atoms/editDialogOpenAtom";
import { selectedPermissionAtom } from "../atoms/selectedPermissionAtom";
import type { Permission } from "../types";

interface ResourcePermissionsPanelProps {
  resource: string;
  permissions: Permission[];
  canEdit?: boolean;
  canDelete?: boolean;
}

function formatActionName(permissionName: string): string {
  const action = permissionName.split(":")[1];
  if (!action) return permissionName;
  return action.charAt(0).toUpperCase() + action.slice(1);
}

export function ResourcePermissionsPanel({
  resource,
  permissions,
  canEdit,
  canDelete,
}: ResourcePermissionsPanelProps) {
  const setSelectedPermission = useSetAtom(selectedPermissionAtom);
  const setEditOpen = useSetAtom(editDialogOpenAtom);
  const setDeleteOpen = useSetAtom(deleteDialogOpenAtom);

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    setEditOpen(true);
  };

  const handleDelete = (permission: Permission) => {
    setSelectedPermission(permission);
    setDeleteOpen(true);
  };

  const resourceLabel = resource.charAt(0).toUpperCase() + resource.slice(1);

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>{resourceLabel}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {permissions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No permissions for this resource.
          </p>
        ) : (
          permissions.map((permission, index) => (
            <div key={permission.id}>
              {index > 0 && <Separator />}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm font-medium shrink-0 w-20">
                    {formatActionName(permission.name)}
                  </span>
                  <span className="text-sm text-muted-foreground truncate">
                    {permission.description || "No description"}
                  </span>
                </div>
                {(canEdit || canDelete) && (
                  <div className="flex items-center gap-1 shrink-0">
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(permission)}
                        aria-label={`Edit ${permission.name}`}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(permission)}
                        aria-label={`Delete ${permission.name}`}
                      >
                        <Trash2 className="size-3.5 text-destructive" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
