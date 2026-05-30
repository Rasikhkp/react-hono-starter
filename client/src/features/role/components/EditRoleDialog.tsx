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
import { editDialogOpenAtom } from "../atoms/editDialogOpenAtom";
import { selectedRoleAtom } from "../atoms/selectedRoleAtom";
import { RoleForm } from "./RoleForm";

export function EditRoleDialog() {
  const [open, setOpen] = useAtom(editDialogOpenAtom);
  const role = useAtomValue(selectedRoleAtom);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPopup className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Update the role details and permissions.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="grid gap-4">
          {role && (
            <RoleForm
              mode="edit"
              role={role}
              onSuccess={() => setOpen(false)}
            />
          )}
        </DialogPanel>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          <Button type="submit" form="role-form">
            Save
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
