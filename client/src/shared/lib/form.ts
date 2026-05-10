import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { PasswordField } from "../components/form/PasswordField";
import { TextField } from "../components/form/TextField";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    PasswordField,
  },
  formComponents: {},
});
