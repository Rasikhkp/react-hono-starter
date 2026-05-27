import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { profileCardSchema } from "@/features/profile/schemas/profileCardSchema";
import { mapAuthPayloadToUser } from "@/features/user/lib/mapAuthPayloadToUser";
import type { User } from "@/features/user/types";
import { authAtom } from "@/shared/atoms/authAtom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileIdentityCard() {
  const [auth, setAuth] = useAtom(authAtom);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await api
        .post("upload/avatar", {
          credentials: "include",
          body: formData,
        })
        .json<{
          data: { url: string } | null;
          error: { message: string } | null;
        }>();
      if (res.error) throw new Error(res.error.message);
      return res.data?.url ?? "";
    },
    onError: (error) => {
      toastManager.add({
        type: "error",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const profileForm = useAppForm({
    defaultValues: {
      name: auth?.name ?? "",
      email: auth?.email ?? "",
      avatar: auth?.avatar ?? "",
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

      const { data, error } = await safeFetch(
        api
          .patch("me", {
            json: {
              name: value.name,
              email: value.email,
              avatar: value.avatar || null,
              oldPassword: oldPw || undefined,
              newPassword: newPw || undefined,
            },
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
        avatar: auth.avatar ?? "",
        oldPassword: "",
        newPassword: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.id, auth?.name, auth?.email, auth?.avatar]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadMutation.mutateAsync(file);
    profileForm.setFieldValue("avatar", url);
  };

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
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                <AvatarImage
                  src={profileForm.getFieldValue("avatar") ?? undefined}
                  alt={auth?.name ?? "User"}
                />
                <AvatarFallback>
                  {getInitials(auth?.name ?? "U")}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  loading={uploadMutation.isPending}
                >
                  Change Avatar
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

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
