import { api } from '@/src/lib/httpClient';
import { API_ENDPOINTS } from '@/src/shared/constans/api-endpoints';
import type { User, UpdateUserRequest } from '@/src/shared/types/api.types';

export const profileApi = {
  /** GET /auth/me or /users/me — current profile */
  getProfile: async (): Promise<User> => {
    try {
      return await api.get<User>(API_ENDPOINTS.PROFILE.ME);
    } catch {
      return await api.get<User>(API_ENDPOINTS.AUTH.ME);
    }
  },

  /** PATCH /users/me or /users/:id */
  updateProfile: async (userId: string, data: UpdateUserRequest): Promise<User> => {
    try {
      return await api.patch<User>(API_ENDPOINTS.PROFILE.ME, data);
    } catch {
      return await api.patch<User>(API_ENDPOINTS.USERS.BY_ID(userId), data);
    }
  },
};
