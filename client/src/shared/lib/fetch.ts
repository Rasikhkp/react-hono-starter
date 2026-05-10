import { createFetch } from "@better-fetch/fetch";
// import { env } from "@/config/env";

export const f = createFetch({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});
