import { createFileRoute } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { breadcrumbAtom } from "@/shared/atoms/breadcrumbAtom";
import { Button } from "@/shared/components/ui/button";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const setBreadcrumb = useSetAtom(breadcrumbAtom);

  setBreadcrumb([
    {
      name: "Home",
      url: "/admin",
    },
  ]);

  const handleClick = async () => {};

  return (
    <div>
      <Button onClick={handleClick}>tes</Button>
    </div>
  );
}
