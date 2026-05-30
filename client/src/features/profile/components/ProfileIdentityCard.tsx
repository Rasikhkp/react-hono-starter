import { useAtom } from "jotai";
import { useEffect } from "react";
import { profileCardSchema } from "@/features/profile/schemas/profileCardSchema";
import { mapAuthPayloadToUser } from "@/features/user/lib/mapAuthPayloadToUser";
import type { User } from "@/features/user/types";
import { authAtom } from "@/shared/atoms/authAtom";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { FieldGroup } from "@/shared/components/ui/field";
import { toastManager } from "@/shared/components/ui/toast";
import { api } from "@/shared/lib/api";
import { useAppForm } from "@/shared/lib/form";
import { safeFetch } from "@/shared/lib/safeFetch";

export function ProfileIdentityCard() {
  const [auth, setAuth] = useAtom(authAtom);

  const profileForm = useAppForm({
    defaultValues: {
      name: auth?.name ?? "",
      email: auth?.email ?? "",
      avatar: auth?.avatar ?? null,
      oldPassword: "",
      newPassword: "",
    },
    validators: {
      onSubmit: profileCardSchema,
      onChange: profileCardSchema,
    },
    onSubmit: async ({ value }) => {
      const oldPw = value.oldPassword.trim();
      const newPw = value.newPassword.trim();

      // Cross-field password validation
      if (auth?.hasPassword) {
        if (oldPw.length > 0 && newPw.length === 0) {
          toastManager.add({
            type: "error",
            title: "Validation error",
            description:
              "New password is required when current password is provided",
          });
          return;
        }
        if (newPw.length > 0 && oldPw.length === 0) {
          toastManager.add({
            type: "error",
            title: "Validation error",
            description:
              "Current password is required when setting a new password",
          });
          return;
        }
        if (oldPw.length > 0 && oldPw.length < 8) {
          toastManager.add({
            type: "error",
            title: "Validation error",
            description: "Current password must be at least 8 characters",
          });
          return;
        }
      }

      if (newPw.length > 0 && newPw.length < 8) {
        toastManager.add({
          type: "error",
          title: "Validation error",
          description: "New password must be at least 8 characters",
        });
        return;
      }

      const formData = new FormData();
      formData.append("name", value.name);
      formData.append("email", value.email);

      const avatar = value.avatar as unknown;
      if (avatar instanceof File) {
        formData.append("avatar", avatar);
      } else if (avatar === null) {
        formData.append("avatar", "");
      }
      // If avatar is a string (existing path), don't append — server leaves it untouched

      if (oldPw) formData.append("oldPassword", oldPw);
      if (newPw) formData.append("newPassword", newPw);

      const { data, error } = await safeFetch(
        api
          .patch("me", {
            body: formData,
            credentials: "include",
          })
          .json<{ data: User }>(),
      );

      if (error) {
        toastManager.add({
          type: "error",
          description: error.message,
          title: "Error occurred",
        });
        return;
      }

      if (data?.data) {
        setAuth(mapAuthPayloadToUser(data.data));
      }

      // Reset password fields after successful update
      profileForm.setFieldValue("oldPassword", "");
      profileForm.setFieldValue("newPassword", "");

      toastManager.add({
        type: "success",
        title: "Profile updated",
      });
    },
  });

  useEffect(() => {
    if (auth) {
      profileForm.reset({
        name: auth.name,
        email: auth.email,
        avatar: auth.avatar ?? null,
        oldPassword: "",
        newPassword: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.id, auth?.name, auth?.email, auth?.avatar]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Update your display name, email, avatar, and password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            profileForm.handleSubmit();
          }}
        >
          <FieldGroup>
            {/* Avatar */}
            <profileForm.AppField name="avatar">
              {(field) => <field.ImageUploadField label="Avatar" />}
            </profileForm.AppField>

            {/* Roles */}
            {auth && auth.roles.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-1.5">Your Roles</div>
                <div className="flex flex-wrap gap-1.5">
                  {auth.roles.map((role) => (
                    <Badge key={role.id} variant="secondary">
                      {role.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Identity */}
            <profileForm.AppField name="name">
              {(field) => <field.TextField label="Name" />}
            </profileForm.AppField>
            <profileForm.AppField name="email">
              {(field) => <field.TextField label="Email" />}
            </profileForm.AppField>

            {/* Password */}
            {auth?.hasPassword ? (
              <>
                <profileForm.AppField name="oldPassword">
                  {(field) => <field.PasswordField label="Current password" />}
                </profileForm.AppField>
                <profileForm.AppField name="newPassword">
                  {(field) => <field.PasswordField label="New password" />}
                </profileForm.AppField>
              </>
            ) : (
              <profileForm.AppField name="newPassword">
                {(field) => <field.PasswordField label="Set password" />}
              </profileForm.AppField>
            )}

            <Button type="submit">Save profile</Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
