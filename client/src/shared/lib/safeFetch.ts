import { isHTTPError, isNetworkError } from "ky";

type SafeError = {
  type: string;
  message: string;
};

type SafeResult<T> = {
  data: T | null;
  error: SafeError | null;
};

export async function safeFetch<T>(
  request: Promise<T>,
): Promise<SafeResult<T>> {
  try {
    const data = await request;

    return { data, error: null };
  } catch (error) {
    if (isHTTPError(error)) {
      if (
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        "type" in error.data
      ) {
        return {
          data: null,
          error: {
            type: error.data.type as string,
            message: error.data.message as string,
          },
        };
      }

      return {
        data: null,
        error: {
          type: "HTTP_ERROR",
          message: "Request failed with HTTP error",
        },
      };
    }

    if (isNetworkError(error)) {
      return {
        data: null,
        error: {
          type: "NETWORK_ERROR",
          message: "Request failed due to a network error",
        },
      };
    }

    return {
      data: null,
      error: {
        type: "UNKNOWN_ERROR",
        message: "Something went wrong. check back later.",
      },
    };
  }
}
