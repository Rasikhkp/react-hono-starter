import { Upload, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useFieldContext } from "@/shared/lib/form";
import { Field, FieldError, FieldLabel } from "../ui/field";

type ImageUploadFieldProps = {
  label: string;
  required?: boolean;
};

export const ImageUploadField = ({
  label,
  required = false,
}: ImageUploadFieldProps) => {
  const field = useFieldContext<string | File | null>();
  const id = useId();
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const imagePath =
    typeof field.state.value === "string" ? field.state.value : null;
  const imageFile =
    field.state.value instanceof File ? field.state.value : null;

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setObjectUrl(null);
  }, [imageFile]);

  const handleFileChange = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    field.handleChange(file);
  };

  const handleRemove = () => {
    field.handleChange(null);
  };

  const hasImage = imagePath || objectUrl;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </FieldLabel>

      {hasImage ? (
        <div className="group relative overflow-hidden rounded-lg border bg-background">
          <img
            src={
              objectUrl ??
              `${import.meta.env.VITE_BACKEND_URL}${imagePath ?? ""}`
            }
            alt="Preview"
            className="h-32 w-full object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="relative flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-background transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Click to upload image
          </span>
          <input
            id={id}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
            className="sr-only"
          />
        </label>
      )}

      {isInvalid && (
        <FieldError
          className="whitespace-pre-line"
          errors={field.state.meta.errors}
        />
      )}
    </Field>
  );
};
