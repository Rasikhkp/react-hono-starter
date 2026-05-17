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
import { deleteDialogOpenAtom } from "../atoms/deleteDialogOpen";
import { selectedUserAtom } from "../atoms/selectedUserAtom";

export default function DeleteUserDialog() {
  const [open, setOpen] = useAtom(deleteDialogOpenAtom);
  const [user] = useAtom(selectedUserAtom);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api
        .delete(`users/${id}`, {
          credentials: "include",
        })
        .json();
    },

    onSuccess: () => {
      toastManager.add({
        type: "success",
        title: "User deleted",
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

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogPopup>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. User <strong>{user?.name}</strong>{" "}
            will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="ghost" />}>
            Cancel
          </AlertDialogClose>

          <AlertDialogClose
            onClick={() => user?.id && deleteMutation.mutate(user.id)}
            render={<Button variant="destructive" />}
          >
            Delete User
          </AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
