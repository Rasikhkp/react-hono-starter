import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";
import type { User } from "@/features/users/types";
import { authAtom } from "@/shared/atoms/authAtom";
import { ThemeToggle } from "@/shared/components/ui/theme-toggle";
import { api } from "@/shared/lib/api";
import { safeFetch } from "@/shared/lib/safeFetch";
import { store } from "@/shared/lib/store";

export const Route = createFileRoute("/_auth-layout")({
  beforeLoad: async () => {
    const user = store.get(authAtom);

    if (user) {
      throw redirect({
        to: "/admin",
      });
    } else {
      const { data } = await safeFetch(
        api.get("me", { credentials: "include" }).json<{ data: User }>(),
      );

      if (data?.data) {
        store.set(authAtom, data.data);
        throw redirect({
          to: "/admin",
        });
      }
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 overflow-hidden">
      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), 
                            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Theme Toggle Positioned Top-Right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Optional: Radial fade to soften edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted via-transparent to-muted pointer-events-none" />

      <div className="relative flex w-full max-w-sm flex-col gap-6 z-10">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>

        <div className="flex flex-col gap-6">
          <Outlet />
          <div className="text-center text-xs text-muted-foreground">
            © 2026 Bintan Resorts. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
