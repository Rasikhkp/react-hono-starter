import { useSetAtom } from "jotai";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Menu,
  MenuGroup,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@/shared/components/ui/menu";
import { deleteDialogOpenAtom } from "../atoms/deleteDialogOpen";
import { editDialogOpenAtom } from "../atoms/editDialoOpenAtom";
import { selectedUserAtom } from "../atoms/selectedUserAtom";
import type { User } from "../types";

export function UserActions({ user }: { user: User }) {
  const setSelectedUser = useSetAtom(selectedUserAtom);
  const setEditDialogOpen = useSetAtom(editDialogOpenAtom);
  const setDeleteDialogOpen = useSetAtom(deleteDialogOpenAtom);

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
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete} className="text-destructive">
            Delete
          </MenuItem>
        </MenuGroup>
      </MenuPopup>
    </Menu>
  );
}
