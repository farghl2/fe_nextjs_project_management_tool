/**
 * Centralised TanStack Query key factory.
 *
 * Hierarchy rules:
 *  ALL    → invalidates every query in that domain
 *  LIST   → invalidates all list variants
 *  DETAIL → invalidates one item
 *
 * Example:
 *   queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.ALL })
 *   // invalidates list, detail, and members
 *
 *   queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS.LIST() })
 *   // invalidates all list variants regardless of params
 */
import type {
  UsersQueryParams,
  ProjectsQueryParams,
  GlobalTasksQueryParams,
  ProjectTasksQueryParams,
  ProjectMembersQueryParams,
} from '@/src/shared/types/api.types';

export const QUERY_KEYS = {
  // ─── Auth ────────────────────────────────────────────────────────────────
  AUTH: {
    ALL: ['auth'] as const,
    ME: ['auth', 'me'] as const,
  },

  // ─── Profile ─────────────────────────────────────────────────────────────
  PROFILE: {
    ME: ['users', 'profile'] as const,
  },

  // ─── Users ───────────────────────────────────────────────────────────────
  USERS: {
    ALL: ['users'] as const,
    LIST: (params?: UsersQueryParams) => ['users', 'list', params] as const,
    DETAIL: (id: string) => ['users', 'detail', id] as const,
  },

  // ─── Projects ────────────────────────────────────────────────────────────
  PROJECTS: {
    ALL: ['projects'] as const,
    LIST: (params?: ProjectsQueryParams) => ['projects', 'list', params] as const,
    DETAIL: (id: string) => ['projects', 'detail', id] as const,
    MEMBERS: (projectId: string, params?: ProjectMembersQueryParams) =>
      ['projects', 'members', projectId, params] as const,
  },

  // ─── Tasks ───────────────────────────────────────────────────────────────
  TASKS: {
    ALL: ['tasks'] as const,
    GLOBAL_LIST: (params?: GlobalTasksQueryParams) => ['tasks', 'global', params] as const,
    PROJECT_LIST: (projectId: string, params?: ProjectTasksQueryParams) =>
      ['tasks', 'project', projectId, params] as const,
    DETAIL: (id: string) => ['tasks', 'detail', id] as const,
  },

  // ─── Dashboard ───────────────────────────────────────────────────────────
  DASHBOARD: {
    OVERVIEW: ['dashboard', 'overview'] as const,
  },
} as const;
