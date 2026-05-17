import { type, type Type } from "arktype";
import { AppError, ERROR_TYPES } from "./error";

export const validateData = <S extends Type>(
  data: unknown,
  schema: S
): S["infer"] => {
  const result = schema(data);

  if (result instanceof type.errors) {
    throw new AppError(
      ERROR_TYPES.VALIDATION_ERROR,
      result.summary,
      400
    );
  }

  return result;
};
