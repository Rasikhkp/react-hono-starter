import arkenv from 'arkenv';

export const env = arkenv({
  JWT_SECRET: "string",
  DATABASE_URL: "string",
  DATABASE_HOST: "string",
  DATABASE_USER: "string",
  DATABASE_PASSWORD: "string",
  DATABASE_NAME: "string",
  DATABASE_PORT: "number",
  ENV: "string"
});
