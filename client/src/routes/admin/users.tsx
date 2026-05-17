import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { deleteManyDialogOpenAtom } from "@/features/user/atoms/deleteManyDialogOpen";
import { selectedUsersAtom } from "@/features/user/atoms/selectedUsersAtom";
import { CreateUserDialog } from "@/features/user/components/CreateUserDialog";
import DeleteUserDialog from "@/features/user/components/DeleteUserDialog";
import DeleteUsersDialog from "@/features/user/components/DeleteUsersDialog";
import { EditUserDialog } from "@/features/user/components/EditUserDialog";
import { filterableUserColumn } from "@/features/user/lib/filterableUserColumn";
import { sortableUserColumn } from "@/features/user/lib/sortableUserColumn";
import { userColumns } from "@/features/user/lib/userColumns";
import type { User } from "@/features/user/types";
import { DataTable } from "@/shared/components/data-table/DataTable";
import { toastManager } from "@/shared/components/ui/toast";
import { useUpdateBreadcrumbs } from "@/shared/hooks/useUpdateBreadcrumbs";
import { api } from "@/shared/lib/api";
import { parseSafeError } from "@/shared/lib/error";

export const Route = createFileRoute("/admin/users")({
  component: RouteComponent,
});

function RouteComponent() {
  useUpdateBreadcrumbs([
    { name: "Home", url: "/admin" },
    { name: "User", url: "/admin/users" },
  ]);

  const setDeleteManyDialogOpen = useSetAtom(deleteManyDialogOpenAtom);
  const setSelectedUsers = useSetAtom(selectedUsersAtom);

  const query = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      api
        .get("users", { credentials: "include" })
        .json<{ data: User[] | null; error: unknown | null }>(),
  });

  if (query.isError) {
    toastManager.add({
      type: "error",
      description: parseSafeError(query.error).message,
      title: "Error occured",
    });
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-5">
        <div className="text-3xl font-bold">User Management</div>

        <CreateUserDialog />
      </div>

      <DataTable
        data={query.data?.data || []}
        searchPlaceholder="Search name or email..."
        isLoading={query.isLoading}
        isError={query.isError}
        columns={userColumns}
        sortableColumns={sortableUserColumn}
        filterableColumns={filterableUserColumn}
        defaultSort={[{ id: "createdAt", desc: true }]}
        onDeleteMany={(users) => {
          setSelectedUsers(users as User[]);
          setDeleteManyDialogOpen(true);
        }}
      />

      <EditUserDialog />
      <DeleteUserDialog />
      <DeleteUsersDialog />
    </div>
  );
}
