import { useNavigate, useSearch } from "@tanstack/react-router";
import type { User } from "@/features/users/types";
import { authAtom } from "@/shared/atoms/authAtom";
import { Button } from "@/shared/components/ui/button";
import { FieldGroup } from "@/shared/components/ui/field";
import { toastManager } from "@/shared/components/ui/toast";
import { api } from "@/shared/lib/api";
import { useAppForm } from "@/shared/lib/form";
import { safeFetch } from "@/shared/lib/safeFetch";
import { store } from "@/shared/lib/store";
import { signInSchema } from "../schemas/signInSchema";

export const SignInForm = () => {
  const navigate = useNavigate();
  const redirect = useSearch({
    from: "/_auth-layout/sign-in",
    select: ({ redirect }) => redirect,
  });

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signInSchema,
      onChange: signInSchema,
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await safeFetch(
        api
          .post("auth/login", {
            json: { password: value.password, email: value.email },
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
        store.set(authAtom, data?.data);

        navigate({ to: redirect });
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="email">
          {(field) => <field.TextField label="Email" required />}
        </form.AppField>

        <form.AppField name="password">
          {(field) => <field.PasswordField label="Password" />}
        </form.AppField>

        <Button type="submit">Sign In</Button>
      </FieldGroup>
    </form>
  );
};
