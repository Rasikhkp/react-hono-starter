import ky from "ky";
import { safeFetch } from "./safeFetch";

export const api = ky.create({
  baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/`,
  hooks: {
    afterResponse: [
      async ({ response, retryCount, request }) => {
        const data = await response.json<{
          data: unknown | null;
          error: { type: string; message: string } | null;
        }>();

        if (
          data.error &&
          data.error.type === "UNAUTHORIZED" &&
          !data.data &&
          retryCount === 0
        ) {
          const { error } = await safeFetch(
            ky
              .post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`, {
                credentials: "include",
              })
              .json(),
          );

          if (!error) {
            return ky.retry({
              request,
            });
          }
        }
      },
    ],
  },
});
