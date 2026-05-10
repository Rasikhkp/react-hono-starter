import { createFileRoute } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { FlightsTable } from "@/features/flights/components/FlightsTable";
import { breadcrumbAtom } from "@/shared/atoms/breadcrumbAtom";

export const Route = createFileRoute("/admin/users")({
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
      name: "User",
      url: "/admin/users",
    },
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-4xl font-bold mb-1">User</div>
      <div className="text-lg text-muted-foreground mb-4">
        User subtitle lalal al alsdjladjsfla kdflajd faldfjaldsjf ladkjfladksf
        alksdjf
      </div>
      <FlightsTable />
    </div>
  );
}
