import { useFieldContext } from "@/shared/lib/form";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldError, FieldLabel } from "../ui/field";

type CheckboxFieldProps = {
  label: string;
};

export const CheckboxField = ({ label }: CheckboxFieldProps) => {
  const field = useFieldContext<boolean>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel>
        <Checkbox
          name={field.name}
          checked={field.state.value}
          onBlur={field.handleBlur}
          onCheckedChange={field.handleChange}
          aria-invalid={isInvalid}
        />
        {label}
      </FieldLabel>
      {isInvalid && (
        <FieldError
          className="whitespace-pre-line"
          errors={field.state.meta.errors}
        />
      )}
    </Field>
  );
};
