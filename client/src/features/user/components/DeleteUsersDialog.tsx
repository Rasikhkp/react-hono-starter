import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { queryClient } from "@/main";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import { toastManager } from "@/shared/components/ui/toast";
import { api } from "@/shared/lib/api";
import { parseSafeError } from "@/shared/lib/error";
import { deleteManyDialogOpenAtom } from "../atoms/deleteManyDialogOpen";
import { selectedUsersAtom } from "../atoms/selectedUsersAtom";

export default function DeleteUsersDialog() {
  const [open, setOpen] = useAtom(deleteManyDialogOpenAtom);
  const [users] = useAtom(selectedUsersAtom);

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return api
        .post("users/bulk-delete", {
          credentials: "include",
          json: { ids },
        })
        .json();
    },

    onSuccess: () => {
      toastManager.add({
        type: "success",
        title: "Users deleted",
      });

      queryClient.invalidateQueries({ queryKey: ["users"] });
      setOpen(false);
    },

    onError: (error: unknown) => {
      const parsedError = parseSafeError(error);

      toastManager.add({
        type: "error",
        title: "Error occurred",
        description: parsedError.message,
      });
    },
  });

  const handleDelete = () => {
    if (!users || users.length === 0) return;

    deleteMutation.mutate(users.map((u) => u.id));
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete selected users?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. <strong>{users?.length ?? 0}</strong>{" "}
            users will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="ghost" />}>
            Cancel
          </AlertDialogClose>

          <AlertDialogClose
            onClick={handleDelete}
            render={<Button variant="destructive" />}
          >
            Delete Users
          </AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
