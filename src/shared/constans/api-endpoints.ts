/**
 * Centralised backend endpoint paths.
 *
 * The axios instance baseURL already includes "/api"
 * (NEXT_PUBLIC_API_URL defaults to http://localhost:3001/api),
 * so paths here start AFTER that prefix.
 *
 * ✓  api.get(API_ENDPOINTS.USERS.BASE)           → GET /api/users
 * ✓  api.get(API_ENDPOINTS.USERS.BY_ID('abc'))   → GET /api/users/abc
 */
export const API_ENDPOINTS = {
  // ─── Auth ────────────────────────────────────────────────────────────────
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },

  // ─── Profile (current-user self-service) ─────────────────────────────────
  PROFILE: {
    ME: '/users/me',
    PASSWORD: '/users/me/password',
  },

  // ─── Users ───────────────────────────────────────────────────────────────
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    STATUS: (id: string) => `/users/${id}/status`,
  },

  // ─── Projects ────────────────────────────────────────────────────────────
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id: string) => `/projects/${id}`,
    MEMBERS: (id: string) => `/projects/${id}/members`,
    MEMBER: (id: string, userId: string) => `/projects/${id}/members/${userId}`,
  },

  // ─── Tasks ───────────────────────────────────────────────────────────────
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id: string) => `/tasks/${id}`,
    BY_PROJECT: (projectId: string) => `/tasks/project/${projectId}`,
  },

  // ─── Dashboard ───────────────────────────────────────────────────────────
  DASHBOARD: {
    BASE: '/dashboard',
  },
} as const;
