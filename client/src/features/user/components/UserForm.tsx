import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { FieldGroup } from "@/shared/components/ui/field";
import { toastManager } from "@/shared/components/ui/toast";
import { api } from "@/shared/lib/api";
import { parseSafeError } from "@/shared/lib/error";
import { useAppForm } from "@/shared/lib/form";
import { createUserSchema } from "../schemas/createUserSchema";
import { editUserSchema } from "../schemas/editUserSchema";
import type { CreateUser, EditUser, User } from "../types";

type CreateModeProps = {
  mode: "create";
  onSuccess: () => void;
};

type EditModeProps = {
  mode: "edit";
  user: User;
  onSuccess: () => void;
};

type UserFormProps = CreateModeProps | EditModeProps;

export const UserForm = (props: UserFormProps) => {
  const isEdit = props.mode === "edit";

  const handleError = (error: unknown) => {
    const parsedError = parseSafeError(error);

    toastManager.add({
      type: "error",
      title: "Error occurred",
      description: parsedError.message,
    });
  };

  const createMutation = useMutation({
    mutationFn: async (data: CreateUser) => {
      return api
        .post("users", {
          credentials: "include",
          json: data,
        })
        .json();
    },

    onSuccess: () => {
      toastManager.add({
        type: "success",
        title: "User created",
      });

      queryClient.invalidateQueries({ queryKey: ["users"] });
      props.onSuccess();
    },

    onError: handleError,
  });

  const editMutation = useMutation({
    mutationFn: async (data: EditUser) => {
      if (!isEdit) {
        throw new Error("Invalid edit state");
      }

      return api
        .put(`users/${props.user.id}`, {
          credentials: "include",
          json: data,
        })
        .json();
    },

    onSuccess: () => {
      toastManager.add({
        type: "success",
        title: "User updated",
      });

      queryClient.invalidateQueries({ queryKey: ["users"] });
      props.onSuccess();
    },

    onError: handleError,
  });

  const form = useAppForm({
    defaultValues: {
      name: isEdit ? props.user.name : "",
      email: isEdit ? props.user.email : "",
      password: "",
      oldPassword: "",
      newPassword: "",
      isActive: isEdit ? Boolean(props.user.isActive) : false,
      isEmailVerified: isEdit ? Boolean(props.user.isEmailVerified) : false,
    },

    validators: {
      onSubmit: isEdit ? editUserSchema : createUserSchema,
      onChange: isEdit ? editUserSchema : createUserSchema,
    },

    onSubmit: ({ value }) => {
      if (isEdit) {
        editMutation.mutate(value);

        return;
      }

      createMutation.mutate(value);
    },
  });

  return (
    <form
      id="user-form"
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

        {isEdit ? (
          <>
            <form.AppField name="oldPassword">
              {(field) => <field.PasswordField label="Old Password" />}
            </form.AppField>

            <form.AppField name="newPassword">
              {(field) => <field.PasswordField label="New Password" />}
            </form.AppField>
          </>
        ) : (
          <form.AppField name="password">
            {(field) => (
              <field.PasswordField label="Password" required={true} />
            )}
          </form.AppField>
        )}

        <form.AppField name="isActive">
          {(field) => <field.CheckboxField label="Is active" />}
        </form.AppField>

        <form.AppField name="isEmailVerified">
          {(field) => <field.CheckboxField label="Is email verified" />}
        </form.AppField>
      </FieldGroup>
    </form>
  );
};
