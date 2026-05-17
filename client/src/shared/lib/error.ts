import { isHTTPError, isNetworkError } from "ky";
import type { SafeError } from "./safeFetch";

export function parseSafeError(error: unknown): SafeError {
  if (isHTTPError(error)) {
    const httpError = error as typeof error & {
      data: {
        error: SafeError;
      };
    };

    return {
      type: httpError.data.error.type,
      message: httpError.data.error.message,
    };
  }

  if (isNetworkError(error)) {
    return {
      type: "NETWORK_ERROR",
      message: "Network error",
    };
  }

  return {
    type: "UNKNOWN_ERROR",
    message: "Something went wrong",
  };
}
