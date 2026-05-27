import { useSetAtom } from "jotai";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Menu,
  MenuGroup,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@/shared/components/ui/menu";
import { usePermission } from "@/shared/hooks/usePermission";
import { deleteDialogOpenAtom } from "../atoms/deleteDialogOpen";
import { editDialogOpenAtom } from "../atoms/editDialoOpenAtom";
import { selectedUserAtom } from "../atoms/selectedUserAtom";
import { viewDialogOpenAtom } from "../atoms/viewDialogOpenAtom";
import type { User } from "../types";

export function UserActions({ user }: { user: User }) {
  const setSelectedUser = useSetAtom(selectedUserAtom);
  const setEditDialogOpen = useSetAtom(editDialogOpenAtom);
  const setDeleteDialogOpen = useSetAtom(deleteDialogOpenAtom);
  const setViewDialogOpen = useSetAtom(viewDialogOpenAtom);
  const { hasPermission } = usePermission();

  const handleView = () => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleEdit = () => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDelete = () => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  return (
    <Menu>
      <MenuTrigger render={<Button size="icon-sm" variant="outline" />}>
        <EllipsisVertical />
      </MenuTrigger>
      <MenuPopup>
        <MenuGroup>
          <MenuItem onClick={handleView}>
            <Eye className="size-4" />
            View
          </MenuItem>
          {hasPermission("users:update") && (
            <MenuItem onClick={handleEdit}>
              <Pencil className="size-4" />
              Edit
            </MenuItem>
          )}
          {hasPermission("users:delete") && (
            <MenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="size-4" />
              Delete
            </MenuItem>
          )}
        </MenuGroup>
      </MenuPopup>
    </Menu>
  );
}
