import { useAtom } from "jotai";
import { useEffect } from "react";
import { profileCardSchema } from "@/features/profile/schemas/profileCardSchema";
import { mapAuthPayloadToUser } from "@/features/user/lib/mapAuthPayloadToUser";
import type { User } from "@/features/user/types";
import { authAtom } from "@/shared/atoms/authAtom";
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
    },
    validators: {
      onSubmit: profileCardSchema,
      onChange: profileCardSchema,
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await safeFetch(
        api
          .patch("me", {
            json: {
              name: value.name,
              email: value.email,
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

      toastManager.add({
        type: "success",
        title: "Profile updated",
      });
    },
  });

  useEffect(() => {
    if (auth) {
      profileForm.reset({ name: auth.name, email: auth.email });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when session user changes only
  }, [auth?.id, auth?.name, auth?.email]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your display name and email.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            profileForm.handleSubmit();
          }}
        >
          <FieldGroup>
            <profileForm.AppField name="name">
              {(field) => <field.TextField label="Name" />}
            </profileForm.AppField>
            <profileForm.AppField name="email">
              {(field) => <field.TextField label="Email" />}
            </profileForm.AppField>
            <Button type="submit">Save profile</Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
