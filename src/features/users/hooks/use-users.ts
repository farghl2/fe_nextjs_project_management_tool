'use client';

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import { QUERY_KEYS } from '@/src/shared/constans/query-keys';
import type { UsersQueryParams } from '@/src/shared/types/api.types';

/** GET /users — paginated, filterable */
export function useUsersQuery(params?: UsersQueryParams) {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.LIST(params),
    queryFn: () => usersApi.getUsers(params),
    staleTime: 1000 * 60 * 3,
  });
}

/** GET /users/:id */
export function useUserQuery(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.DETAIL(id),
    queryFn: () => usersApi.getUserById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 3,
  });
}

// ─── Backward-compat aliases ──────────────────────────────────────────────────
/** @deprecated Use useUsersQuery */
export const useUsers = useUsersQuery;
/** @deprecated Use useUserQuery */
export const useUser = useUserQuery;
