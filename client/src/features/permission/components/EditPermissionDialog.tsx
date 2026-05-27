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
import { selectedPermissionAtom } from "../atoms/selectedPermissionAtom";
import { PermissionForm } from "./PermissionForm";

export function EditPermissionDialog() {
  const [open, setOpen] = useAtom(editDialogOpenAtom);
  const permission = useAtomValue(selectedPermissionAtom);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPopup className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Permission</DialogTitle>
          <DialogDescription>Update the permission details.</DialogDescription>
        </DialogHeader>
        <DialogPanel className="grid gap-4">
          {permission && (
            <PermissionForm
              mode="edit"
              permission={permission}
              onSuccess={() => setOpen(false)}
            />
          )}
        </DialogPanel>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          <Button type="submit" form="permission-form">
            Save
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
