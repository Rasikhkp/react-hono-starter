import arkenv from "@arkenv/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { type } from "arkenv";
import { defineConfig } from "vite";

export const Env = type({
  VITE_BACKEND_URL: "string.url",
});

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    viteReact(),
    arkenv(Env),
  ],
});

export default config;
