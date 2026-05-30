import { useState } from "react";
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
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { RoleForm } from "./RoleForm";

export function CreateRoleDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Create Role</DialogTrigger>
      <DialogPopup className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>
          <DialogDescription>
            Define a new role and assign permissions to it.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel className="grid gap-4">
          <RoleForm mode="create" onSuccess={() => setOpen(false)} />
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
