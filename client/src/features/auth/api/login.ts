import { f } from "@/shared/lib/fetch";

export async function login(email: string, password: string) {
  return await f("/api/auth/login", {
    method: "POST",
    body: { password, email },
    credentials: "include",
  });
}
