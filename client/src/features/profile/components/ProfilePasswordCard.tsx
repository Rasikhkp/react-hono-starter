import { useAtom } from "jotai";
import { setPasswordSchema } from "@/features/auth/schemas/setPasswordSchema";
import { changePasswordCardSchema } from "@/features/profile/schemas/profileCardSchema";
import { mapAuthPayloadToUser } from "@/features/user/lib/mapAuthPayloadToUser";
import type { User } from "@/features/user/types";
import { authAtom } from "@/shared/atoms/authAtom";
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
import { api } from "@/shared/lib/api";
import { useAppForm } from "@/shared/lib/form";
import { safeFetch } from "@/shared/lib/safeFetch";

export function ProfilePasswordCard() {
  const [auth, setAuth] = useAtom(authAtom);

  const needsPassword = auth?.hasPassword === false;

  const changePasswordForm = useAppForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
    validators: {
      onSubmit: changePasswordCardSchema,
      onChange: changePasswordCardSchema,
    },
    onSubmit: async ({ value }) => {
      if (!auth) {
        return;
      }

      const { data, error } = await safeFetch(
        api
          .patch("me", {
            json: {
              name: auth.name,
              email: auth.email,
              oldPassword: value.oldPassword,
              newPassword: value.newPassword,
            },
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
        return;
      }

      if (data?.data) {
        setAuth(mapAuthPayloadToUser(data.data));
      }

      changePasswordForm.reset();
      toastManager.add({
        type: "success",
        title: "Password updated",
      });
    },
  });

  const setPasswordForm = useAppForm({
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
      } else if (data?.data) {
        setAuth(mapAuthPayloadToUser(data.data));
        toastManager.add({
          type: "success",
          title: "Password saved",
          description: "You can now sign in with email and password.",
        });
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          {needsPassword
            ? "Add email/password sign-in (same credentials on the sign-in page)."
            : "Change your password with your current password."}
        </CardDescription>
      </CardHeader>
      {needsPassword ? (
        <>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPasswordForm.handleSubmit();
              }}
            >
              <FieldGroup>
                <setPasswordForm.AppField name="password">
                  {(field) => <field.PasswordField label="Password" />}
                </setPasswordForm.AppField>
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              changePasswordForm.handleSubmit();
            }}
          >
            <FieldGroup>
              <changePasswordForm.AppField name="oldPassword">
                {(field) => <field.PasswordField label="Current password" />}
              </changePasswordForm.AppField>
              <changePasswordForm.AppField name="newPassword">
                {(field) => <field.PasswordField label="New password" />}
              </changePasswordForm.AppField>
              <Button type="submit">Update password</Button>
            </FieldGroup>
          </form>
        </CardContent>
      )}
    </Card>
  );
}
