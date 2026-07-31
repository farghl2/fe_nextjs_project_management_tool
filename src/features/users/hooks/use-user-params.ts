'use client';

import { useQueryState, parseAsString, parseAsInteger, parseAsBoolean } from 'nuqs';
import { useCallback } from 'react';
import type { UsersQueryParams } from '@/src/shared/types/api.types';

export function useUserParams() {
  const [search, setSearchRaw] = useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({ shallow: true })
  );

  const [isActive, setIsActiveRaw] = useQueryState(
    'isActive',
    parseAsBoolean.withOptions({ shallow: true })
  );

  const [sortBy, setSortByRaw] = useQueryState(
    'sortBy',
    parseAsString.withDefault('name').withOptions({ shallow: true })
  );

  const [sortOrder, setSortOrderRaw] = useQueryState(
    'sortOrder',
    parseAsString.withDefault('asc').withOptions({ shallow: true })
  );

  const [page, setPageRaw] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ shallow: true })
  );

  const [limit, setLimitRaw] = useQueryState(
    'limit',
    parseAsInteger.withDefault(10).withOptions({ shallow: true })
  );

  const setSearch = useCallback(
    (newSearch: string) => {
      setSearchRaw(newSearch || null);
      setPageRaw(1);
    },
    [setSearchRaw, setPageRaw]
  );

  const setIsActive = useCallback(
    (value: boolean | null) => {
      setIsActiveRaw(value);
      setPageRaw(1);
    },
    [setIsActiveRaw, setPageRaw]
  );

  const setSortBy = useCallback(
    (newSortBy: string) => {
      setSortByRaw(newSortBy);
      setPageRaw(1);
    },
    [setSortByRaw, setPageRaw]
  );

  const setSortOrder = useCallback(
    (newSortOrder: 'asc' | 'desc') => {
      setSortOrderRaw(newSortOrder);
      setPageRaw(1);
    },
    [setSortOrderRaw, setPageRaw]
  );

  const setPage = useCallback(
    (newPage: number) => setPageRaw(newPage),
    [setPageRaw]
  );

  const setLimit = useCallback(
    (newLimit: number) => {
      setLimitRaw(newLimit);
      setPageRaw(1);
    },
    [setLimitRaw, setPageRaw]
  );

  const clearFilters = useCallback(() => {
    setSearchRaw(null);
    setIsActiveRaw(null);
    setSortByRaw('name');
    setSortOrderRaw('asc');
    setPageRaw(1);
  }, [setSearchRaw, setIsActiveRaw, setSortByRaw, setSortOrderRaw, setPageRaw]);

  const queryParams: UsersQueryParams = {
    search: search || undefined,
    isActive: isActive ?? undefined,
    sortBy: (sortBy as UsersQueryParams['sortBy']) || 'name',
    sortOrder: (sortOrder as 'asc' | 'desc') || 'asc',
    page: page || 1,
    limit: limit || 10,
  };

  return {
    search,
    isActive,
    sortBy,
    sortOrder,
    page,
    limit,
    queryParams,
    setSearch,
    setIsActive,
    setSortBy,
    setSortOrder,
    setPage,
    setLimit,
    clearFilters,
  };
}
