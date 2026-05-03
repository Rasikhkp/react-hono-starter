import { type } from "arktype";

export const RegisterSchema = type({
  email: "string.email",
  name: "string >= 2",
  password: "string >= 6",
  confirmPassword: "string >= 6",
}).narrow((data, ctx) => {
  if (data.password === data.confirmPassword) {
    return true
  }
  return ctx.reject({
    expected: "identical to password",
    actual: "",
    path: ["confirmPassword"]
  })
});

export const LoginSchema = type({
  email: "string.email",
  password: "string",
});
