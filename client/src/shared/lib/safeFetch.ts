import { parseSafeError } from "./error";

export type SafeError = {
  type: string;
  message: string;
};

export type SafeResult<T> = {
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
    const parsedError = parseSafeError(error);

    return {
      data: null,
      error: parsedError,
    };
  }
}
