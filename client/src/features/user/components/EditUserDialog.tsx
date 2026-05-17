import { useAtom, useAtomValue } from "jotai";
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
import { editDialogOpenAtom } from "../atoms/editDialoOpenAtom";
import { selectedUserAtom } from "../atoms/selectedUserAtom";
import { UserForm } from "./UserForm";

export function EditUserDialog() {
  const [open, setOpen] = useAtom(editDialogOpenAtom);
  const user = useAtomValue(selectedUserAtom);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPopup className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Fill in the information below to create a user
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="grid gap-4">
          {user && (
            <UserForm
              mode="edit"
              user={user}
              onSuccess={() => setOpen(false)}
            />
          )}
        </DialogPanel>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          <Button type="submit" form="user-form">
            Save
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
