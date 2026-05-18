import { createFileRoute, Link } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { useState } from "react";
import { setPasswordSchema } from "@/features/auth/schemas/setPasswordSchema";
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
import { FieldGroup } from "@/shared/components/ui/field";
import { toastManager } from "@/shared/components/ui/toast";
import { useUpdateBreadcrumbs } from "@/shared/hooks/useUpdateBreadcrumbs";
import { api } from "@/shared/lib/api";
import { useAppForm } from "@/shared/lib/form";
import { safeFetch } from "@/shared/lib/safeFetch";

export const Route = createFileRoute("/admin/security")({
  component: SecurityPage,
});

function SecurityPage() {
  useUpdateBreadcrumbs([
    { name: "Home", url: "/admin" },
    { name: "Account security", url: "/admin/security" },
  ]);

  const [auth, setAuth] = useAtom(authAtom);
  const [unlinkOpen, setUnlinkOpen] = useState(false);

  const form = useAppForm({
    defaultValues: {
      password: "",
    },
    validators: {
      onSubmit: setPasswordSchema,
      onChange: setPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await safeFetch(
        api
          .post("auth/set-password", {
            json: { password: value.password },
            credentials: "include",
          })
          .json<{ data: User }>(),
      );

      if (error) {
        toastManager.add({
          type: "error",
          description: error.message,
          title: "Error occured",
        });
      } else {
        setAuth(data?.data ?? null);
        toastManager.add({
          type: "success",
          title: "Password saved",
          description: "You can now sign in with email and password.",
        });
      }
    },
  });

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

    setAuth(data?.data ?? null);
    setUnlinkOpen(false);
    toastManager.add({
      type: "success",
      title: "Google disconnected",
    });
  };

  const needsPassword = auth?.hasPassword === false;
  const canUnlinkGoogle = Boolean(auth?.googleSub && auth?.hasPassword);

  return (
    <div className="max-w-lg mx-auto space-y-8">
      {!auth?.hasPassword && auth?.googleSub ? (
        <p className="text-sm text-muted-foreground">
          You&apos;re signed in with Google only. Add a password below any time
          so you can also sign in with email (
          <Link className="underline" to="/sign-in">
            sign-in page
          </Link>
          ).
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Set password</CardTitle>
          <CardDescription>
            Add or enable email/password sign-in (same credentials on the{" "}
            <Link className="underline" to="/sign-in">
              sign-in page
            </Link>
            ).
          </CardDescription>
        </CardHeader>
        {needsPassword ? (
          <>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
              >
                <FieldGroup>
                  <form.AppField name="password">
                    {(field) => <field.PasswordField label="Password" />}
                  </form.AppField>
                  <Button type="submit">Save password</Button>
                </FieldGroup>
              </form>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Use this email ({auth?.email}) with the password you set here.
              </p>
            </CardFooter>
          </>
        ) : (
          <CardContent>
            <p className="text-sm text-muted-foreground">
              A password is already set. Use the Users admin flows if you
              support password changes there.
            </p>
          </CardContent>
        )}
      </Card>

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
    </div>
  );
}
