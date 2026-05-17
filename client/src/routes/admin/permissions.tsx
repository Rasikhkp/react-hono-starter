import { createFileRoute } from "@tanstack/react-router";
import { useUpdateBreadcrumbs } from "@/shared/hooks/useUpdateBreadcrumbs";

export const Route = createFileRoute("/admin/permissions")({
  component: RouteComponent,
});

function RouteComponent() {
  useUpdateBreadcrumbs([
    { name: "Home", url: "/admin" },
    { name: "Permission", url: "/admin/permissions" },
  ]);

  return (
    <div>
      lala
      <div>lajdksfl</div>
    </div>
  );
}
