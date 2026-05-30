import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
import { ServerDataTable } from "@/shared/components/data-table/ServerDataTable";
import type {
  FilterableColumn,
  PaginatedResponse,
  SortableColumn,
} from "@/shared/types/dataTable";

type DemoItem = {
  id: string;
  name: string;
  category: string;
  status: string;
  price: number;
  createdAt: string;
};

type DemoSchema = {
  search?: string;
  page: number;
  pageSize: number;
  sort?: string;
  order?: "asc" | "desc";
  category?: string;
  status?: string;
};

const mockData: DemoItem[] = [
  {
    id: "1",
    name: "Wireless Mouse",
    category: "Electronics",
    status: "Active",
    price: 29.99,
    createdAt: "2025-01-15",
  },
  {
    id: "2",
    name: "Mechanical Keyboard",
    category: "Electronics",
    status: "Active",
    price: 89.99,
    createdAt: "2025-02-10",
  },
  {
    id: "3",
    name: "USB-C Hub",
    category: "Electronics",
    status: "Draft",
    price: 45.0,
    createdAt: "2025-03-05",
  },
  {
    id: "4",
    name: "Cotton T-Shirt",
    category: "Clothing",
    status: "Active",
    price: 24.99,
    createdAt: "2025-01-20",
  },
  {
    id: "5",
    name: "Denim Jacket",
    category: "Clothing",
    status: "Inactive",
    price: 120.0,
    createdAt: "2024-12-01",
  },
  {
    id: "6",
    name: "Running Shoes",
    category: "Clothing",
    status: "Active",
    price: 95.0,
    createdAt: "2025-03-15",
  },
  {
    id: "7",
    name: "Organic Green Tea",
    category: "Food",
    status: "Active",
    price: 12.99,
    createdAt: "2025-02-28",
  },
  {
    id: "8",
    name: "Dark Chocolate Bar",
    category: "Food",
    status: "Draft",
    price: 5.99,
    createdAt: "2025-04-01",
  },
  {
    id: "9",
    name: "Bluetooth Speaker",
    category: "Electronics",
    status: "Active",
    price: 59.99,
    createdAt: "2025-01-05",
  },
  {
    id: "10",
    name: "Yoga Mat",
    category: "Sports",
    status: "Active",
    price: 34.99,
    createdAt: "2025-03-10",
  },
  {
    id: "11",
    name: "Dumbbell Set",
    category: "Sports",
    status: "Inactive",
    price: 150.0,
    createdAt: "2024-11-20",
  },
  {
    id: "12",
    name: "Resistance Bands",
    category: "Sports",
    status: "Active",
    price: 19.99,
    createdAt: "2025-02-15",
  },
  {
    id: "13",
    name: "LED Desk Lamp",
    category: "Electronics",
    status: "Active",
    price: 39.99,
    createdAt: "2025-04-10",
  },
  {
    id: "14",
    name: "Leather Wallet",
    category: "Accessories",
    status: "Draft",
    price: 49.99,
    createdAt: "2025-03-25",
  },
  {
    id: "15",
    name: "Sunglasses",
    category: "Accessories",
    status: "Active",
    price: 79.99,
    createdAt: "2025-01-30",
  },
  {
    id: "16",
    name: "Backpack",
    category: "Accessories",
    status: "Active",
    price: 65.0,
    createdAt: "2025-02-20",
  },
  {
    id: "17",
    name: "Stainless Steel Bottle",
    category: "Accessories",
    status: "Active",
    price: 22.99,
    createdAt: "2025-04-05",
  },
  {
    id: "18",
    name: "Notebook Set",
    category: "Stationery",
    status: "Active",
    price: 14.99,
    createdAt: "2025-03-01",
  },
  {
    id: "19",
    name: "Fountain Pen",
    category: "Stationery",
    status: "Draft",
    price: 35.0,
    createdAt: "2025-02-25",
  },
  {
    id: "20",
    name: "Desk Organizer",
    category: "Stationery",
    status: "Active",
    price: 28.99,
    createdAt: "2025-01-10",
  },
  {
    id: "21",
    name: "Noise Cancelling Headphones",
    category: "Electronics",
    status: "Active",
    price: 249.99,
    createdAt: "2025-04-15",
  },
  {
    id: "22",
    name: "Webcam HD",
    category: "Electronics",
    status: "Inactive",
    price: 79.99,
    createdAt: "2024-12-10",
  },
  {
    id: "23",
    name: "Microphone",
    category: "Electronics",
    status: "Active",
    price: 129.99,
    createdAt: "2025-03-20",
  },
  {
    id: "24",
    name: "Winter Jacket",
    category: "Clothing",
    status: "Draft",
    price: 199.99,
    createdAt: "2025-04-20",
  },
  {
    id: "25",
    name: "Casual Sneakers",
    category: "Clothing",
    status: "Active",
    price: 85.0,
    createdAt: "2025-02-05",
  },
  {
    id: "26",
    name: "Protein Powder",
    category: "Food",
    status: "Active",
    price: 44.99,
    createdAt: "2025-01-25",
  },
  {
    id: "27",
    name: "Almond Butter",
    category: "Food",
    status: "Inactive",
    price: 15.99,
    createdAt: "2024-11-30",
  },
  {
    id: "28",
    name: "Jump Rope",
    category: "Sports",
    status: "Active",
    price: 12.99,
    createdAt: "2025-03-05",
  },
  {
    id: "29",
    name: "Foam Roller",
    category: "Sports",
    status: "Draft",
    price: 29.99,
    createdAt: "2025-04-12",
  },
  {
    id: "30",
    name: "Wireless Charger",
    category: "Electronics",
    status: "Active",
    price: 19.99,
    createdAt: "2025-02-18",
  },
  {
    id: "31",
    name: "Smart Watch Band",
    category: "Accessories",
    status: "Active",
    price: 25.0,
    createdAt: "2025-03-30",
  },
  {
    id: "32",
    name: "Pencil Case",
    category: "Stationery",
    status: "Inactive",
    price: 9.99,
    createdAt: "2024-12-15",
  },
  {
    id: "33",
    name: "Sticky Notes Set",
    category: "Stationery",
    status: "Active",
    price: 7.99,
    createdAt: "2025-01-05",
  },
  {
    id: "34",
    name: "Graphic T-Shirt",
    category: "Clothing",
    status: "Active",
    price: 29.99,
    createdAt: "2025-04-08",
  },
  {
    id: "35",
    name: "HDMI Cable",
    category: "Electronics",
    status: "Active",
    price: 12.99,
    createdAt: "2025-03-12",
  },
  {
    id: "36",
    name: "Monitor Stand",
    category: "Electronics",
    status: "Draft",
    price: 55.0,
    createdAt: "2025-02-22",
  },
  {
    id: "37",
    name: "Coffee Maker",
    category: "Electronics",
    status: "Active",
    price: 89.99,
    createdAt: "2025-01-18",
  },
  {
    id: "38",
    name: "Hiking Boots",
    category: "Clothing",
    status: "Active",
    price: 140.0,
    createdAt: "2025-04-18",
  },
  {
    id: "39",
    name: "Trail Mix",
    category: "Food",
    status: "Active",
    price: 8.99,
    createdAt: "2025-03-22",
  },
  {
    id: "40",
    name: "Water Bottle",
    category: "Sports",
    status: "Inactive",
    price: 18.99,
    createdAt: "2024-12-20",
  },
  {
    id: "41",
    name: "Gaming Mouse Pad",
    category: "Electronics",
    status: "Active",
    price: 34.99,
    createdAt: "2025-04-22",
  },
  {
    id: "42",
    name: "Wool Scarf",
    category: "Clothing",
    status: "Draft",
    price: 39.99,
    createdAt: "2025-02-28",
  },
  {
    id: "43",
    name: "Electric Kettle",
    category: "Electronics",
    status: "Active",
    price: 49.99,
    createdAt: "2025-01-12",
  },
  {
    id: "44",
    name: "Plant Pot Set",
    category: "Accessories",
    status: "Active",
    price: 32.99,
    createdAt: "2025-03-08",
  },
  {
    id: "45",
    name: "Desk Pad",
    category: "Stationery",
    status: "Active",
    price: 16.99,
    createdAt: "2025-04-02",
  },
];

const demoColumns: ColumnDef<DemoItem>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    size: 240,
    enableSorting: true,
  },
  {
    id: "category",
    accessorKey: "category",
    header: "Category",
    size: 140,
    enableSorting: true,
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    size: 120,
    enableSorting: false,
  },
  {
    id: "price",
    accessorKey: "price",
    header: "Price",
    size: 120,
    enableSorting: true,
    cell: ({ getValue }) => {
      const price = getValue<number>();
      return <span>${price.toFixed(2)}</span>;
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created",
    size: 140,
    enableSorting: true,
  },
];

const sortableDemoColumns: SortableColumn[] = [
  { label: "Name (A-Z)", id: "name", desc: false },
  { label: "Name (Z-A)", id: "name", desc: true },
  { label: "Price (low to high)", id: "price", desc: false },
  { label: "Price (high to low)", id: "price", desc: true },
  { label: "Newest first", id: "createdAt", desc: true },
  { label: "Oldest first", id: "createdAt", desc: false },
];

const categories = Array.from(new Set(mockData.map((d) => d.category)));
const statuses = Array.from(new Set(mockData.map((d) => d.status)));

const filterableDemoColumns: FilterableColumn[] = [
  {
    id: "category",
    label: "Category",
    type: "select",
    multiple: false,
    options: categories.map((c) => ({ label: c, value: c })),
  },
  {
    id: "status",
    label: "Status",
    type: "checkbox",
    multiple: true,
    options: statuses.map((s) => ({ label: s, value: s })),
  },
];

function simulateSearch(params: DemoSchema): PaginatedResponse<DemoItem> {
  let filtered = [...mockData];

  // Search filter
  if (params.search) {
    const term = params.search.toLowerCase();
    filtered = filtered.filter((d) => d.name.toLowerCase().includes(term));
  }

  // Category filter
  if (params.category) {
    filtered = filtered.filter((d) => d.category === params.category);
  }

  // Status filter
  if (params.status) {
    const statusList = params.status.split(",");
    filtered = filtered.filter((d) => statusList.includes(d.status));
  }

  // Sort
  if (params.sort) {
    filtered.sort((a, b) => {
      const aVal = a[params.sort as keyof DemoItem];
      const bVal = b[params.sort as keyof DemoItem];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return params.order === "desc"
          ? bVal.localeCompare(aVal)
          : aVal.localeCompare(bVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return params.order === "desc" ? bVal - aVal : aVal - bVal;
      }

      return 0;
    });
  }

  // Pagination
  const total = filtered.length;
  const start = (params.page - 1) * params.pageSize;
  const paged = filtered.slice(start, start + params.pageSize);

  return {
    data: paged,
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      total,
      totalPages: Math.ceil(total / params.pageSize),
    },
  };
}

export const Route = createFileRoute("/admin/demo-server-table")({
  validateSearch: (input: Record<string, unknown>): DemoSchema => ({
    search: (input.search as string) || undefined,
    page: Math.max(1, Number(input.page) || 1),
    pageSize: Math.min(50, Math.max(1, Number(input.pageSize) || 10)),
    sort: (input.sort as string) || undefined,
    order: (input.order as "asc" | "desc") || undefined,
    category: (input.category as string) || undefined,
    status: (input.status as string) || undefined,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const query = useQuery({
    queryKey: ["demo-items", search],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return simulateSearch(search);
    },
  });

  const result = query.data;

  const columnFilters: ColumnFiltersState = [];
  if (search.category) {
    columnFilters.push({ id: "category", value: search.category });
  }
  if (search.status) {
    columnFilters.push({ id: "status", value: search.status });
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-5">
        <div className="text-3xl font-bold">Server-Side DataTable Demo</div>
        <p className="text-muted-foreground text-sm mt-1">
          All state lives in URL query params. Try sorting, filtering, and
          paginating — then refresh the page.
        </p>
      </div>

      <ServerDataTable
        data={result?.data ?? []}
        isLoading={query.isLoading}
        isError={query.isError}
        columns={demoColumns}
        pageCount={result?.pagination.totalPages ?? 0}
        totalRowCount={result?.pagination.total ?? 0}
        state={{
          pagination: {
            pageIndex: search.page - 1,
            pageSize: search.pageSize,
          },
          sorting: search.sort
            ? [{ id: search.sort, desc: search.order === "desc" }]
            : [],
          globalFilter: search.search ?? "",
          columnFilters,
        }}
        onPaginationChange={(updater) => {
          const next =
            typeof updater === "function"
              ? updater({
                  pageIndex: search.page - 1,
                  pageSize: search.pageSize,
                })
              : updater;
          navigate({
            search: {
              ...search,
              page: next.pageIndex + 1,
              pageSize: next.pageSize,
            },
          });
        }}
        onSortingChange={(updater) => {
          const next =
            typeof updater === "function"
              ? updater(
                  search.sort
                    ? [{ id: search.sort, desc: search.order === "desc" }]
                    : [],
                )
              : updater;
          navigate({
            search: {
              ...search,
              sort: next[0]?.id,
              order: next[0]?.desc ? "desc" : "asc",
              page: 1,
            },
          });
        }}
        onGlobalFilterChange={(updater) => {
          const next =
            typeof updater === "function"
              ? updater(search.search ?? "")
              : updater;
          navigate({
            search: { ...search, search: next || undefined, page: 1 },
          });
        }}
        onColumnFiltersChange={(updater) => {
          const next =
            typeof updater === "function" ? updater(columnFilters) : updater;

          const filters: Record<string, string | undefined> = {};
          for (const f of next) {
            if (Array.isArray(f.value) && f.value.length > 0) {
              filters[f.id] = f.value.join(",");
            } else if (
              !Array.isArray(f.value) &&
              f.value !== undefined &&
              f.value !== null &&
              f.value !== ""
            ) {
              filters[f.id] = String(f.value);
            }
          }

          navigate({ search: { ...search, ...filters, page: 1 } });
        }}
        searchPlaceholder="Search products..."
        sortableColumns={sortableDemoColumns}
        filterableColumns={filterableDemoColumns}
      />
    </div>
  );
}
