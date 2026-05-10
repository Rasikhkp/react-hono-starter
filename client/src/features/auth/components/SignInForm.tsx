import { Button } from "@/shared/components/ui/button";
import { FieldGroup } from "@/shared/components/ui/field";
import { useAppForm } from "@/shared/lib/form";
import { signInSchema } from "../schemas/signInSchema";
import { login } from "../api/login";
import { toastManager } from "@/shared/components/ui/toast";

export const SignInForm = () => {
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
      console.log("value", value);
      const { error } = await login(value.email, value.password);

      if (error) {
        toastManager.add({
          description: "There was a problem with your request.",
          title: error.error.message,
          type: "error",
        });
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
