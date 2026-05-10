import { useId } from "react";
import { useFieldContext } from "@/shared/lib/form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type TextFieldProps = {
  label: string;
  placeholder?: string;
  required?: boolean;
};

export const TextField = ({
  label,
  placeholder,
  required = false,
}: TextFieldProps) => {
  const field = useFieldContext<string>();
  const id = useId();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </FieldLabel>
      <Input
        id={id}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder={placeholder}
      />
      {isInvalid && (
        <FieldError
          className="whitespace-pre-line"
          errors={field.state.meta.errors}
        />
      )}
    </Field>
  );
};
