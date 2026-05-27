import { useSetAtom } from "jotai";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@/shared/components/ui/menu";
import { deleteDialogOpenAtom } from "../atoms/deleteDialogOpenAtom";
import { editDialogOpenAtom } from "../atoms/editDialogOpenAtom";
import { selectedPermissionAtom } from "../atoms/selectedPermissionAtom";
import type { Permission } from "../types";

interface PermissionCardProps {
  permission: Permission;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function PermissionCard({
  permission,
  canEdit,
  canDelete,
}: PermissionCardProps) {
  const setSelectedPermission = useSetAtom(selectedPermissionAtom);
  const setEditOpen = useSetAtom(editDialogOpenAtom);
  const setDeleteOpen = useSetAtom(deleteDialogOpenAtom);

  const handleEdit = () => {
    setSelectedPermission(permission);
    setEditOpen(true);
  };

  const handleDelete = () => {
    setSelectedPermission(permission);
    setDeleteOpen(true);
  };

  const hasActions = canEdit || canDelete;

  return (
    <Card>
      <CardHeader className="has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle>{permission.name}</CardTitle>
        <CardDescription>
          {permission.description || "No description"}
        </CardDescription>
        {hasActions && (
          <div className="col-start-2 row-span-2 row-start-1 inline-flex self-start justify-self-end">
            <Menu>
              <MenuTrigger
                render={
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="size-4" />
                  </Button>
                }
              />
              <MenuPopup className="min-w-32">
                {canEdit && (
                  <MenuItem onClick={handleEdit}>
                    <Pencil className="size-4" />
                    Edit
                  </MenuItem>
                )}
                {canDelete && (
                  <MenuItem variant="destructive" onClick={handleDelete}>
                    <Trash2 className="size-4" />
                    Delete
                  </MenuItem>
                )}
              </MenuPopup>
            </Menu>
          </div>
        )}
      </CardHeader>
      <CardPanel className="pt-0">
        <Badge variant="default">{permission.resource}</Badge>
      </CardPanel>
    </Card>
  );
}
