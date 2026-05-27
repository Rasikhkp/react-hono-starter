import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import { FieldGroup } from "@/shared/components/ui/field";
import { toastManager } from "@/shared/components/ui/toast";
import { api } from "@/shared/lib/api";
import { parseSafeError } from "@/shared/lib/error";
import { useAppForm } from "@/shared/lib/form";
import { createPermissionSchema } from "../schemas/createPermissionSchema";
import { editPermissionSchema } from "../schemas/editPermissionSchema";
import type { CreatePermission, EditPermission, Permission } from "../types";

type CreateModeProps = {
  mode: "create";
  onSuccess: () => void;
};

type EditModeProps = {
  mode: "edit";
  permission: Permission;
  onSuccess: () => void;
};

type PermissionFormProps = CreateModeProps | EditModeProps;

export const PermissionForm = (props: PermissionFormProps) => {
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
    mutationFn: async (data: CreatePermission) => {
      return api
        .post("permissions", { credentials: "include", json: data })
        .json();
    },
    onSuccess: () => {
      toastManager.add({ type: "success", title: "Permission created" });
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      props.onSuccess();
    },
    onError: handleError,
  });

  const editMutation = useMutation({
    mutationFn: async (data: EditPermission) => {
      if (!isEdit) throw new Error("Invalid edit state");
      return api
        .put(`permissions/${props.permission.id}`, {
          credentials: "include",
          json: data,
        })
        .json();
    },
    onSuccess: () => {
      toastManager.add({ type: "success", title: "Permission updated" });
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      props.onSuccess();
    },
    onError: handleError,
  });

  const form = useAppForm({
    defaultValues: {
      name: isEdit ? props.permission.name : "",
      resource: isEdit ? props.permission.resource : "",
      description: isEdit ? (props.permission.description ?? "") : "",
    },
    validators: {
      onSubmit: isEdit ? editPermissionSchema : createPermissionSchema,
      onChange: isEdit ? editPermissionSchema : createPermissionSchema,
    },
    onSubmit: ({ value }) => {
      if (isEdit) {
        editMutation.mutate({ id: props.permission.id, ...value });
      } else {
        createMutation.mutate(value);
      }
    },
  });

  return (
    <form
      id="permission-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="name">
          {(field) => (
            <field.TextField
              label="Name"
              placeholder="e.g. posts:create"
              required
            />
          )}
        </form.AppField>

        <form.AppField name="resource">
          {(field) => (
            <field.TextField
              label="Resource"
              placeholder="e.g. posts"
              required
            />
          )}
        </form.AppField>

        <form.AppField name="description">
          {(field) => (
            <field.TextField
              label="Description"
              placeholder="What this permission allows..."
            />
          )}
        </form.AppField>
      </FieldGroup>
    </form>
  );
};
