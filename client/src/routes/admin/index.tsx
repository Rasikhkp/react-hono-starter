import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { authAtom } from "@/shared/atoms/authAtom";
import { Button } from "@/shared/components/ui/button";
import { useUpdateBreadcrumbs } from "@/shared/hooks/useUpdateBreadcrumbs";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useAtomValue(authAtom);

  useUpdateBreadcrumbs([{ name: "Home", url: "/admin" }]);

  const handleClick = async () => {
    console.log("user", user);
  };

  return (
    <div>
      <Button onClick={handleClick}>tes</Button>
    </div>
  );
}
