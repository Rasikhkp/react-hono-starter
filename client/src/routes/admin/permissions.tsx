import { createFileRoute } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { breadcrumbAtom } from "@/shared/atoms/breadcrumbAtom";

export const Route = createFileRoute("/admin/permissions")({
  component: RouteComponent,
});

function RouteComponent() {
  const setBreadcrumb = useSetAtom(breadcrumbAtom);

  setBreadcrumb([
    {
      name: "Home",
      url: "/admin",
    },
    {
      name: "Permission",
      url: "/admin/permissions",
    },
  ]);

  return (
    <div>
      lala
      <div>lajdksfl</div>
    </div>
  );
}
