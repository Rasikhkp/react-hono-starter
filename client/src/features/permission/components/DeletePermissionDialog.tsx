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
import { deleteDialogOpenAtom } from "../atoms/deleteDialogOpenAtom";
import { selectedPermissionAtom } from "../atoms/selectedPermissionAtom";

export function DeletePermissionDialog() {
  const [open, setOpen] = useAtom(deleteDialogOpenAtom);
  const [permission] = useAtom(selectedPermissionAtom);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`permissions/${id}`, { credentials: "include" }).json();
    },
    onSuccess: () => {
      toastManager.add({ type: "success", title: "Permission deleted" });
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
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
            This action cannot be undone. Permission{" "}
            <strong>{permission?.name}</strong> will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="ghost" />}>
            Cancel
          </AlertDialogClose>
          <AlertDialogClose
            onClick={() =>
              permission?.id && deleteMutation.mutate(permission.id)
            }
            render={<Button variant="destructive" />}
          >
            Delete Permission
          </AlertDialogClose>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
