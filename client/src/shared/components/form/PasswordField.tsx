import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

import { useFieldContext } from "@/shared/lib/form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type PasswordFieldProps = {
  label: string;
  required?: boolean;
};

export const PasswordField = ({
  label,
  required = false,
}: PasswordFieldProps) => {
  const field = useFieldContext<string>();

  const id = useId();

  const [showPassword, setShowPassword] = useState(false);

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </FieldLabel>

      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          placeholder="********"
          className="pr-10"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>

      {isInvalid && (
        <FieldError
          className="whitespace-pre-line"
          errors={field.state.meta.errors}
        />
      )}
    </Field>
  );
};
