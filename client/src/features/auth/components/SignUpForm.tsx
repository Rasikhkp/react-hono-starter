import { useNavigate } from "@tanstack/react-router";
import type { User } from "@/features/user/types";
import { authAtom } from "@/shared/atoms/authAtom";
import { Button } from "@/shared/components/ui/button";
import { FieldGroup } from "@/shared/components/ui/field";
import { toastManager } from "@/shared/components/ui/toast";
import { api } from "@/shared/lib/api";
import { useAppForm } from "@/shared/lib/form";
import { safeFetch } from "@/shared/lib/safeFetch";
import { store } from "@/shared/lib/store";
import { signUpSchema } from "../schemas/signUpSchema";

export const SignUpForm = () => {
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signUpSchema,
      onChange: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await safeFetch(
        api
          .post("auth/register", {
            json: {
              name: value.name,
              password: value.password,
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
      } else {
        store.set(authAtom, data?.data);

        navigate({ to: "/admin" });
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
        <form.AppField name="name">
          {(field) => (
            <field.TextField label="Name" placeholder="John Doe" required />
          )}
        </form.AppField>

        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label="Email"
              placeholder="you@example.com"
              required
            />
          )}
        </form.AppField>

        <form.AppField name="password">
          {(field) => <field.PasswordField label="Password" />}
        </form.AppField>

        <Button type="submit">Sign Up</Button>
      </FieldGroup>
    </form>
  );
};
