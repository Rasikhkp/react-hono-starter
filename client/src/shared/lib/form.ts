import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { CheckboxField } from "../components/form/CheckboxField";
import { ImageUploadField } from "../components/form/ImageUploadField";
import { PasswordField } from "../components/form/PasswordField";
import { TextField } from "../components/form/TextField";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    ImageUploadField,
    PasswordField,
    CheckboxField,
  },
  formComponents: {},
});
