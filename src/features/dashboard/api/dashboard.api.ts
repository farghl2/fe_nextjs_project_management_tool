import { api } from '@/src/lib/httpClient';
import { API_ENDPOINTS } from '@/src/shared/constans/api-endpoints';
import type { DashboardData } from '@/src/shared/types/api.types';

/**
 * GET /dashboard
 *
 * The backend returns role-aware data — ADMIN receives aggregate stats
 * across all users/projects, MEMBER receives their own scoped stats.
 * The frontend uses a single query and lets components branch on `data.role`.
 *
 * NOTE: The response body shape is defined by DashboardData in api.types.ts.
 * If the backend wraps this in { data: DashboardData } the response interceptor
 * in httpClient handles unwrapping transparently.
 */
export const dashboardApi = {
  getDashboard: (): Promise<DashboardData> =>
    api.get<DashboardData>(API_ENDPOINTS.DASHBOARD.BASE),
};
