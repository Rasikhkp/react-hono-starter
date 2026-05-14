import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import { authAtom } from "@/shared/atoms/authAtom";
import { breadcrumbAtom } from "@/shared/atoms/breadcrumbAtom";
import { Button } from "@/shared/components/ui/button";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const setBreadcrumb = useSetAtom(breadcrumbAtom);
  const user = useAtomValue(authAtom);

  setBreadcrumb([
    {
      name: "Home",
      url: "/admin",
    },
  ]);

  const handleClick = async () => {
    console.log("user", user);
  };

  return (
    <div>
      <Button onClick={handleClick}>tes</Button>
    </div>
  );
}
