import { type } from "arktype";

const RegisterSchema = type({
  email: "string.email",
  password: "string >= 6",
  name: "string >= 2",
});

const LoginSchema = type({
  email: "string.email",
  password: "string",
});

export { RegisterSchema, LoginSchema }
