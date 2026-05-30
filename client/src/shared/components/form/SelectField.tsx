import { useId } from "react";
import { useFieldContext } from "@/shared/lib/form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Select, SelectItem, SelectPopup, SelectTrigger } from "../ui/select";

type SelectFieldProps = {
  label: string;
  options: { label: string; value: string }[];
  placeholder?: string;
};

export const SelectField = ({
  label,
  options,
  placeholder = "Select...",
}: SelectFieldProps) => {
  const field = useFieldContext<string[]>();
  const id = useId();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const selectedLabels = options
    .filter((opt) => field.state.value.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
        multiple
      >
        <SelectTrigger>
          {selectedLabels.length > 0 ? (
            <span className="flex-1 truncate">{selectedLabels.join(", ")}</span>
          ) : (
            <span className="flex-1 truncate text-muted-foreground/72">
              {placeholder}
            </span>
          )}
        </SelectTrigger>
        <SelectPopup>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
      {isInvalid && (
        <FieldError
          className="whitespace-pre-line"
          errors={field.state.meta.errors}
        />
      )}
    </Field>
  );
};
