'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';
import { QUERY_KEYS } from '@/src/shared/constans/query-keys';

/**
 * GET /dashboard — single role-aware dashboard query.
 *
 * The backend returns:
 *   { success, message, data: DashboardData, timestamp, path }
 * The httpClient unwraps the envelope, so queryFn receives DashboardData directly.
 *
 * staleTime = 2 min: data changes frequently but we avoid hammering the server.
 * All mutations that affect dashboard metrics invalidate QUERY_KEYS.DASHBOARD.OVERVIEW.
 */
export function useDashboardQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.OVERVIEW,
    queryFn: dashboardApi.getDashboard,
    staleTime: 1000 * 60 * 2,
  });
}

// ─── Backward-compat split hooks ─────────────────────────────────────────────
// All three share the same cache entry — zero extra network calls.

/** @deprecated Use useDashboardQuery and read data.stats */
export function useDashboardStats() {
  const query = useDashboardQuery();
  return {
    ...query,
    data: query.data?.stats,
  };
}

/** @deprecated Use useDashboardQuery and read data.recentProjects */
export function useRecentProjects() {
  const query = useDashboardQuery();
  return {
    ...query,
    data: query.data?.recentProjects ?? [],
  };
}

/** @deprecated Use useDashboardQuery and read data.recentTasks */
export function useRecentTasks() {
  const query = useDashboardQuery();
  return {
    ...query,
    data: query.data?.recentTasks ?? [],
  };
}
