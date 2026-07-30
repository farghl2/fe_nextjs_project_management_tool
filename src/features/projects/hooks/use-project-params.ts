'use client';

import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
import { useCallback } from 'react';
import type { ProjectsQueryParams } from '@/src/shared/types/api.types';

export function useProjectParams() {
  const [search, setSearchRaw] = useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({ shallow: true })
  );

  const [sortBy, setSortByRaw] = useQueryState(
    'sortBy',
    parseAsString.withDefault('createdAt').withOptions({ shallow: true })
  );

  const [sortOrder, setSortOrderRaw] = useQueryState(
    'sortOrder',
    parseAsString.withDefault('desc').withOptions({ shallow: true })
  );

  const [page, setPageRaw] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ shallow: true })
  );

  const [limit, setLimitRaw] = useQueryState(
    'limit',
    parseAsInteger.withDefault(12).withOptions({ shallow: true })
  );

  const setSearch = useCallback(
    (newSearch: string) => {
      setSearchRaw(newSearch || null);
      setPageRaw(1);
    },
    [setSearchRaw, setPageRaw]
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
    setSortByRaw('createdAt');
    setSortOrderRaw('desc');
    setPageRaw(1);
  }, [setSearchRaw, setSortByRaw, setSortOrderRaw, setPageRaw]);

  const VALID_SORT_BY: ProjectsQueryParams['sortBy'][] = ['createdAt', 'updatedAt', 'name'];
  const safeSortBy =
    VALID_SORT_BY.includes(sortBy as ProjectsQueryParams['sortBy'])
      ? (sortBy as ProjectsQueryParams['sortBy'])
      : 'createdAt';

  const queryParams: ProjectsQueryParams = {
    search: search || undefined,
    sortBy: safeSortBy,
    sortOrder: (sortOrder as 'asc' | 'desc') || 'desc',
    page: page || 1,
    limit: limit || 12,
  };

  return {
    search,
    sortBy,
    sortOrder,
    page,
    limit,
    queryParams,
    setSearch,
    setSortBy,
    setSortOrder,
    setPage,
    setLimit,
    clearFilters,
  };
}
