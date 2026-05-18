import { useAtom } from "jotai";
import { useState } from "react";
import { mapAuthPayloadToUser } from "@/features/user/lib/mapAuthPayloadToUser";
import type { User } from "@/features/user/types";
import { authAtom } from "@/shared/atoms/authAtom";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { toastManager } from "@/shared/components/ui/toast";
import { api } from "@/shared/lib/api";
import { safeFetch } from "@/shared/lib/safeFetch";

export function ProfileGoogleCard() {
  const [auth, setAuth] = useAtom(authAtom);
  const [unlinkOpen, setUnlinkOpen] = useState(false);

  const canUnlinkGoogle = Boolean(auth?.googleSub && auth?.hasPassword);

  const unlinkGoogle = async () => {
    const { data, error } = await safeFetch(
      api
        .post("auth/unlink-google", { credentials: "include" })
        .json<{ data: User }>(),
    );

    if (error) {
      toastManager.add({
        type: "error",
        description: error.message,
        title: "Error occured",
      });
      return;
    }

    if (data?.data) {
      setAuth(mapAuthPayloadToUser(data.data));
    }
    setUnlinkOpen(false);
    toastManager.add({
      type: "success",
      title: "Google disconnected",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Google account</CardTitle>
          <CardDescription>
            Disconnect Google only after a password is set so you retain access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {auth?.googleSub ? (
            <p className="text-sm">Google sign-in is connected.</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Google isn&apos;t linked yet. Choose{" "}
              <span className="text-foreground">Continue with Google</span> on
              the sign-in page to link automatically when your Google email is
              verified.
            </p>
          )}
        </CardContent>
        {auth?.googleSub ? (
          <CardFooter className="flex flex-wrap gap-2">
            <Button
              variant="destructive"
              disabled={!canUnlinkGoogle}
              onClick={() => setUnlinkOpen(true)}
            >
              Disconnect Google
            </Button>
            {!canUnlinkGoogle ? (
              <p className="text-xs text-muted-foreground w-full">
                Set a password above before disconnecting Google.
              </p>
            ) : null}
          </CardFooter>
        ) : null}
      </Card>

      <AlertDialog open={unlinkOpen} onOpenChange={setUnlinkOpen}>
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Google?</AlertDialogTitle>
            <AlertDialogDescription>
              You will still be able to sign in with email and password. This
              does not delete your account.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant="ghost" />}>
              Cancel
            </AlertDialogClose>

            <AlertDialogClose
              onClick={() => {
                void unlinkGoogle();
              }}
              render={<Button variant="destructive" />}
            >
              Disconnect
            </AlertDialogClose>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </>
  );
}
