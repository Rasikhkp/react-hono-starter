import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import type { User } from "@/features/user/types";
import { authAtom } from "@/shared/atoms/authAtom";
import { AppSidebar } from "@/shared/components/AppSidebar";
import { NavBar } from "@/shared/components/NavBar";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { api } from "@/shared/lib/api";
import { safeFetch } from "@/shared/lib/safeFetch";
import { store } from "@/shared/lib/store";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    const user = store.get(authAtom);

    if (!user) {
      const { data, error } = await safeFetch(
        api.get("me", { credentials: "include" }).json<{ data: User }>(),
      );

      if (error && error.type === "UNAUTHORIZED") {
        throw redirect({
          to: "/sign-in",
          search: {
            redirect: location.href,
          },
        });
      }

      store.set(authAtom, data?.data);
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavBar />
        <div className="px-4 pt-4 pb-10 min-h-[calc(100vh-var(--navbar-height))] relative isolate">
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
            style={{
              backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), 
                        linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Fade overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none -z-10" />

          {/* Content */}
          <div className="relative z-10">
            <Outlet />
          </div>

          {/* Footer */}
          <div className="w-full text-center left-0 bottom-0 absolute text-xs py-2">
            © 2026 Bintan Resorts. All rights reserved.
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
