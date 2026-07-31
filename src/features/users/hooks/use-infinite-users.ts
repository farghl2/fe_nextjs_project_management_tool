'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import type { UsersQueryParams } from '@/src/shared/types/api.types';

const ASSIGNEE_PAGE_SIZE = 15;

/**
 * Infinite-scroll version of the users list.
 * Used by the AssigneeSelect component so the dropdown loads users
 * page-by-page as the user scrolls, rather than dumping every user at once.
 *
 * Query key is separate from QUERY_KEYS.USERS.LIST so it doesn't
 * accidentally invalidate the paginated Users management table.
 */
export function useInfiniteUsersQuery(search?: string, extraParams?: Omit<UsersQueryParams, 'page' | 'limit' | 'search'>) {
  return useInfiniteQuery({
    queryKey: ['users', 'infinite', search ?? '', extraParams],
    queryFn: ({ pageParam = 1 }) =>
      usersApi.getUsers({
        ...extraParams,
        search: search || undefined,
        page: pageParam as number,
        limit: ASSIGNEE_PAGE_SIZE,
        isActive: true,          // only show active users in the assignee picker
        sortBy: 'name',
        sortOrder: 'asc',
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.meta?.page ?? 1;
      const totalPages = lastPage.meta?.totalPages ?? 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
}
