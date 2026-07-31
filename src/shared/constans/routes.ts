/**
 * Frontend navigation route constants.
 * Pathnames used with next-intl's useRouter / Link.
 * The locale prefix (/ar, /en) is injected automatically by next-intl.
 */
export const APP_ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROJECT: (id: string) => `/projects/${id}`,
  TASKS: '/tasks',
  USERS: '/users',
  PROFILE: '/profile',
} as const;
