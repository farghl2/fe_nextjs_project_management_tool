'use client';

import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
import { useCallback } from 'react';
import type { ProjectTasksQueryParams, GlobalTasksQueryParams } from '@/src/shared/types/api.types';

export function useTaskParams() {
  const [view, setViewRaw] = useQueryState(
    'view',
    parseAsString.withDefault('board').withOptions({ shallow: true })
  );

  const [search, setSearchRaw] = useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({ shallow: true })
  );

  const [status, setStatusRaw] = useQueryState(
    'status',
    parseAsString.withDefault('ALL').withOptions({ shallow: true })
  );

  const [priority, setPriorityRaw] = useQueryState(
    'priority',
    parseAsString.withDefault('ALL').withOptions({ shallow: true })
  );

  const [assigneeId, setAssigneeIdRaw] = useQueryState(
    'assigneeId',
    parseAsString.withDefault('ALL').withOptions({ shallow: true })
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
    parseAsInteger.withDefault(10).withOptions({ shallow: true })
  );

  const setView = useCallback(
    (newView: 'board' | 'list') => {
      setViewRaw(newView);
      setPageRaw(1);
    },
    [setViewRaw, setPageRaw]
  );

  const setSearch = useCallback(
    (newSearch: string) => {
      setSearchRaw(newSearch || null);
      setPageRaw(1);
    },
    [setSearchRaw, setPageRaw]
  );

  const setStatus = useCallback(
    (newStatus: string) => {
      setStatusRaw(newStatus === 'ALL' ? null : newStatus);
      setPageRaw(1);
    },
    [setStatusRaw, setPageRaw]
  );

  const setPriority = useCallback(
    (newPriority: string) => {
      setPriorityRaw(newPriority === 'ALL' ? null : newPriority);
      setPageRaw(1);
    },
    [setPriorityRaw, setPageRaw]
  );

  const setAssigneeId = useCallback(
    (newAssigneeId: string) => {
      setAssigneeIdRaw(newAssigneeId === 'ALL' ? null : newAssigneeId);
      setPageRaw(1);
    },
    [setAssigneeIdRaw, setPageRaw]
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
    setStatusRaw(null);
    setPriorityRaw(null);
    setAssigneeIdRaw(null);
    setSortByRaw('createdAt');
    setSortOrderRaw('desc');
    setPageRaw(1);
  }, [setSearchRaw, setStatusRaw, setPriorityRaw, setAssigneeIdRaw, setSortByRaw, setSortOrderRaw, setPageRaw]);

  /** Params for project-scoped task queries */
  const projectQueryParams: ProjectTasksQueryParams = {
    search: search || undefined,
    status: status && status !== 'ALL' ? (status as ProjectTasksQueryParams['status']) : undefined,
    priority: priority && priority !== 'ALL' ? (priority as ProjectTasksQueryParams['priority']) : undefined,
    assigneeId: assigneeId && assigneeId !== 'ALL' ? assigneeId : undefined,
    sortBy: (sortBy as ProjectTasksQueryParams['sortBy']) || 'createdAt',
    sortOrder: (sortOrder as 'asc' | 'desc') || 'desc',
    page: page || 1,
    limit: limit || 10,
  };

  /** Params for global task queries */
  const globalQueryParams: GlobalTasksQueryParams = {
    ...projectQueryParams,
  };

  return {
    view: (view as 'board' | 'list') || 'board',
    search,
    status: status || 'ALL',
    priority: priority || 'ALL',
    assigneeId: assigneeId || 'ALL',
    sortBy,
    sortOrder,
    page,
    limit,
    /** @deprecated use projectQueryParams or globalQueryParams */
    queryParams: projectQueryParams,
    projectQueryParams,
    globalQueryParams,
    setView,
    setSearch,
    setStatus,
    setPriority,
    setAssigneeId,
    setSortBy,
    setSortOrder,
    setPage,
    setLimit,
    clearFilters,
  };
}
