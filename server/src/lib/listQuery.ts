import { sql } from "kysely";

type ListQueryOptions<T> = {
  query: any;
  search?: {
    term: string;
    columns: (keyof T & string)[];
  };
  sort?: {
    column: string;
    order: "asc" | "desc";
  };
  filters?: Record<string, unknown>;
  page: number;
  pageSize: number;
};

type PaginatedResult<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export async function buildListQuery<T>(
  options: ListQueryOptions<T>,
): Promise<PaginatedResult<T>> {
  const { query: baseQuery, search, sort, filters, page, pageSize } = options;

  const safePage = Math.max(1, page);
  const safePageSize = Math.min(Math.max(1, pageSize), 100);
  const offset = (safePage - 1) * safePageSize;

  let dataQuery = baseQuery;

  // Apply search (LIKE across specified columns)
  if (search?.term && search.columns.length > 0) {
    dataQuery = dataQuery.where((eb: any) => {
      const conditions = search.columns.map((col) =>
        eb(col, "like", `%${search.term}%`),
      );
      return eb.or(conditions);
    });
  }

  // Apply filters
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null || value === "") continue;
      if (Array.isArray(value) && value.length > 0) {
        dataQuery = dataQuery.where(key, "in", value);
      } else {
        dataQuery = dataQuery.where(key, "=", value);
      }
    }
  }

  // Get total count
  const countResult = await dataQuery
    .clearSelect()
    .select(sql<number>`count(*)`.as("total"))
    .executeTakeFirst();

  const total = Number((countResult as Record<string, unknown>)?.total ?? 0);

  // Apply sorting
  if (sort?.column) {
    dataQuery = dataQuery.orderBy(sort.column, sort.order ?? "asc");
  }

  // Apply pagination
  dataQuery = dataQuery.limit(safePageSize).offset(offset);

  const data = await dataQuery.execute();

  return {
    data: data as T[],
    pagination: {
      page: safePage,
      pageSize: safePageSize,
      total,
      totalPages: Math.ceil(total / safePageSize),
    },
  };
}
