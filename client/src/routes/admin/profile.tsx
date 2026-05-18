import { createFileRoute } from "@tanstack/react-router";
import { AccountProfile } from "@/features/profile/components/AccountProfile";
import { useUpdateBreadcrumbs } from "@/shared/hooks/useUpdateBreadcrumbs";

export const Route = createFileRoute("/admin/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  useUpdateBreadcrumbs([
    { name: "Home", url: "/admin" },
    { name: "Profile", url: "/admin/profile" },
  ]);

  return <AccountProfile />;
}
