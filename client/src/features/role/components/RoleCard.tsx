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
import { selectedRoleAtom } from "../atoms/selectedRoleAtom";
import type { Role } from "../types";

interface RoleCardProps {
  role: Role;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function RoleCard({ role, canEdit, canDelete }: RoleCardProps) {
  const setSelectedRole = useSetAtom(selectedRoleAtom);
  const setEditOpen = useSetAtom(editDialogOpenAtom);
  const setDeleteOpen = useSetAtom(deleteDialogOpenAtom);

  const handleEdit = () => {
    setSelectedRole(role);
    setEditOpen(true);
  };

  const handleDelete = () => {
    setSelectedRole(role);
    setDeleteOpen(true);
  };

  const hasActions = canEdit || canDelete;

  return (
    <Card>
      <CardHeader className="has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <CardTitle>{role.name}</CardTitle>
        <CardDescription>
          {role.description || "No description"}
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
        <div className="flex flex-wrap gap-1.5">
          {role.permissions.length === 0 ? (
            <span className="text-muted-foreground text-sm">
              No permissions assigned
            </span>
          ) : (
            <>
              {role.permissions.slice(0, 6).map((perm) => (
                <Badge key={perm.id} variant="secondary" size="sm">
                  {perm.name}
                </Badge>
              ))}
              {role.permissions.length > 6 && (
                <Badge variant="outline" size="sm">
                  +{role.permissions.length - 6} more
                </Badge>
              )}
            </>
          )}
        </div>
      </CardPanel>
    </Card>
  );
}
