import { api } from '@/src/lib/httpClient';
import { API_ENDPOINTS } from '@/src/shared/constans/api-endpoints';
import type {
  LoginRequest,
  AuthUser,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '@/src/shared/types/api.types';

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  /** POST /auth/login — authenticate with email + password */
  login: (credentials: LoginRequest): Promise<AuthUser> =>
    api.post<AuthUser>(API_ENDPOINTS.AUTH.LOGIN, credentials),

  /** POST /auth/refresh — silently refresh the access token (HttpOnly cookie) */
  refresh: (): Promise<void> =>
    api.post<void>(API_ENDPOINTS.AUTH.REFRESH),

  /** POST /auth/logout — invalidate the session server-side */
  logout: (): Promise<void> =>
    api.post<void>(API_ENDPOINTS.AUTH.LOGOUT),

  /** GET /auth/me — fetch the currently authenticated user from the auth context */
  me: (): Promise<AuthUser> =>
    api.get<AuthUser>(API_ENDPOINTS.AUTH.ME),
};

// ─── Profile (current-user self-service) ─────────────────────────────────────

export const profileApi = {
  /** GET /users/me — full profile of the current user */
  getProfile: (): Promise<AuthUser> =>
    api.get<AuthUser>(API_ENDPOINTS.PROFILE.ME),

  /** PATCH /users/me — update current user's profile fields */
  updateProfile: (data: UpdateProfileRequest): Promise<AuthUser> =>
    api.patch<AuthUser>(API_ENDPOINTS.PROFILE.ME, data),

  /** PATCH /users/me/password — change current user's password */
  changePassword: (data: ChangePasswordRequest): Promise<void> =>
    api.patch<void>(API_ENDPOINTS.PROFILE.PASSWORD, data),
};
