import { Loader2, Upload, X } from "lucide-react";
import { useId, useState } from "react";
import { toastManager } from "@/shared/components/ui/toast";
import { api } from "@/shared/lib/api";
import { parseSafeError } from "@/shared/lib/error";
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
  const field = useFieldContext<string>();
  const id = useId();
  const [uploading, setUploading] = useState(false);
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const imagePath = field.state.value;

  const handleFileChange = async (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api
        .post("upload", { credentials: "include", body: formData })
        .json<{ data: { path: string } | null; error: unknown | null }>();

      if (res.data?.path) {
        field.handleChange(res.data.path);
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      const parsed = parseSafeError(err);
      toastManager.add({
        type: "error",
        title: "Upload failed",
        description: parsed.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    field.handleChange("");
  };

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </FieldLabel>

      {imagePath ? (
        <div className="group relative overflow-hidden rounded-lg border bg-background">
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}${imagePath}`}
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
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Uploading...
              </span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to upload image
              </span>
            </>
          )}
          <input
            id={id}
            type="file"
            accept="image/*"
            disabled={uploading}
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
