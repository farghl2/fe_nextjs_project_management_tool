import type { PaginatedResponse } from '@/src/shared/types/api.types';

/**
 * Universal normaliser for NestJS / REST API paginated list responses.
 * Handles top-level meta, top-level total/totalPages, raw arrays, and fallback length pagination.
 */
export function normalisePaginatedResponse<T>(
  response: unknown,
  params?: { page?: number; limit?: number },
  defaultLimit = 10,
  itemMapper: (item: any) => T = (x) => x
): PaginatedResponse<T> {
  if (!response) {
    return {
      data: [],
      meta: { page: 1, limit: defaultLimit, total: 0, totalPages: 1 },
      totalPages: 1,
      total: 0,
      page: 1,
      limit: defaultLimit,
    };
  }

  const currentPage = Number(params?.page) || 1;
  const currentLimit = Number(params?.limit) || defaultLimit;

  // 1. Raw array response
  if (Array.isArray(response)) {
    const data = response.map(itemMapper);
    const total = data.length;
    const totalPages = Math.max(1, Math.ceil(total / (currentLimit || 1)));
    return {
      data,
      meta: { page: currentPage, limit: currentLimit, total, totalPages },
      totalPages,
      total,
      page: currentPage,
      limit: currentLimit,
    };
  }

  const res = response as Record<string, any>;

  // 2. Extract data array
  const rawData: any[] = Array.isArray(res.data)
    ? res.data
    : Array.isArray(res.items)
    ? res.items
    : Array.isArray(res.projects)
    ? res.projects
    : Array.isArray(res.tasks)
    ? res.tasks
    : Array.isArray(res.users)
    ? res.users
    : Array.isArray(res.members)
    ? res.members
    : [];

  const data = rawData.map(itemMapper);

  // 3. Extract page and limit from response or params
  const page = Number(
    res.meta?.page ??
    res.page ??
    res.currentPage ??
    currentPage
  ) || 1;

  const limit = Number(
    res.meta?.limit ??
    res.limit ??
    res.pageSize ??
    res.perPage ??
    currentLimit
  ) || defaultLimit;

  // 4. Extract total count from response metadata
  const rawTotal =
    res.meta?.total ??
    res.meta?.totalItems ??
    res.total ??
    res.totalCount ??
    res.count ??
    res.totalItems;

  // 5. Extract or calculate totalPages
  const rawTotalPages =
    res.meta?.totalPages ??
    res.meta?.pageCount ??
    res.totalPages ??
    res.pageCount;

  let total: number;
  let totalPages: number;

  if (rawTotalPages !== undefined && rawTotalPages !== null) {
    totalPages = Math.max(1, Number(rawTotalPages));
    total = rawTotal !== undefined && rawTotal !== null ? Number(rawTotal) : data.length;
  } else if (rawTotal !== undefined && rawTotal !== null) {
    total = Number(rawTotal);
    totalPages = Math.max(1, Math.ceil(total / (limit || 1)));
  } else {
    // Backend returned no total metadata: if we received a full page of items (data.length === limit),
    // there is likely a next page available!
    if (data.length >= limit && limit > 0) {
      totalPages = page + 1;
      total = page * limit + 1; // estimate
    } else {
      totalPages = page;
      total = (page - 1) * limit + data.length;
    }
  }

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
    totalPages,
    total,
    page,
    limit,
  };
}
