import { useMutation, useQuery } from "@tanstack/react-query";
import type { Permission } from "@/features/permission/types";
import { queryClient } from "@/main";
import { FieldGroup } from "@/shared/components/ui/field";
import { toastManager } from "@/shared/components/ui/toast";
import { api } from "@/shared/lib/api";
import { parseSafeError } from "@/shared/lib/error";
import { useAppForm } from "@/shared/lib/form";
import { createRoleSchema } from "../schemas/createRoleSchema";
import { editRoleSchema } from "../schemas/editRoleSchema";
import type { CreateRole, EditRole, Role } from "../types";
import { PermissionSelector } from "./PermissionSelector";

type CreateModeProps = {
  mode: "create";
  onSuccess: () => void;
};

type EditModeProps = {
  mode: "edit";
  role: Role;
  onSuccess: () => void;
};

type RoleFormProps = CreateModeProps | EditModeProps;

export const RoleForm = (props: RoleFormProps) => {
  const isEdit = props.mode === "edit";

  const permissionsQuery = useQuery({
    queryKey: ["permissions"],
    queryFn: () =>
      api
        .get("permissions", { credentials: "include" })
        .json<{ data: Permission[] | null; error: unknown | null }>(),
  });

  const permissions = permissionsQuery.data?.data ?? [];

  const handleError = (error: unknown) => {
    const parsedError = parseSafeError(error);
    toastManager.add({
      type: "error",
      title: "Error occurred",
      description: parsedError.message,
    });
  };

  const createMutation = useMutation({
    mutationFn: async (data: CreateRole) => {
      return api.post("roles", { credentials: "include", json: data }).json();
    },
    onSuccess: () => {
      toastManager.add({ type: "success", title: "Role created" });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      props.onSuccess();
    },
    onError: handleError,
  });

  const editMutation = useMutation({
    mutationFn: async (data: EditRole) => {
      if (!isEdit) throw new Error("Invalid edit state");
      return api
        .put(`roles/${props.role.id}`, { credentials: "include", json: data })
        .json();
    },
    onSuccess: () => {
      toastManager.add({ type: "success", title: "Role updated" });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      props.onSuccess();
    },
    onError: handleError,
  });

  const form = useAppForm({
    defaultValues: {
      name: isEdit ? props.role.name : "",
      description: isEdit ? (props.role.description ?? "") : "",
      permissionIds: isEdit ? props.role.permissions.map((p) => p.id) : [],
    },
    validators: {
      onSubmit: isEdit ? editRoleSchema : createRoleSchema,
      onChange: isEdit ? editRoleSchema : createRoleSchema,
    },
    onSubmit: ({ value }) => {
      if (isEdit) {
        editMutation.mutate({ id: props.role.id, ...value });
      } else {
        createMutation.mutate(value);
      }
    },
  });

  return (
    <form
      id="role-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="name">
          {(field) => (
            <field.TextField label="Name" placeholder="e.g. Editor" required />
          )}
        </form.AppField>

        <form.AppField name="description">
          {(field) => (
            <field.TextField
              label="Description"
              placeholder="What this role can do..."
            />
          )}
        </form.AppField>

        <form.AppField name="permissionIds">
          {(field) => (
            <PermissionSelector
              permissions={permissions}
              value={field.state.value ?? []}
              onChange={field.handleChange}
              loading={permissionsQuery.isLoading}
            />
          )}
        </form.AppField>
      </FieldGroup>
    </form>
  );
};
