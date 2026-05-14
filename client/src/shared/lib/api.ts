import ky from "ky";

export const api = ky.create({
  baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/`,
});
