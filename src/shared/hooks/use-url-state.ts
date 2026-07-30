'use client';

import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';

export function useSearchQueryState(defaultValue = '') {
  return useQueryState('search', parseAsString.withDefault(defaultValue).withOptions({ shallow: true }));
}

export function usePaginationState(defaultPage = 1, defaultLimit = 10) {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(defaultPage).withOptions({ shallow: true }));
  const [limit, setLimit] = useQueryState('limit', parseAsInteger.withDefault(defaultLimit).withOptions({ shallow: true }));

  return {
    page,
    limit,
    setPage,
    setLimit,
  };
}

export function useFilterState(key: string, defaultValue = 'ALL') {
  return useQueryState(key, parseAsString.withDefault(defaultValue).withOptions({ shallow: true }));
}
