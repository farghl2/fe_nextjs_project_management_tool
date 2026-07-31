import { api } from '@/src/lib/httpClient';
import { API_ENDPOINTS } from '@/src/shared/constans/api-endpoints';
import { normalisePaginatedResponse } from '@/src/shared/lib/normalise-paginated-response';
import type {
  User,
  UserListResponse,
  UsersQueryParams,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserStatusRequest,
} from '@/src/shared/types/api.types';

function sanitiseCreateUserPayload(
  data: CreateUserRequest & { confirmPassword?: string }
): CreateUserRequest {
  const { confirmPassword, ...clean } = data;
  return {
    ...clean,
    job: clean.job?.trim() || undefined,
    image: clean.image?.trim() || undefined,
    description: clean.description?.trim() || undefined,
    phone: clean.phone?.trim() || undefined,
  };
}

export const usersApi = {
  /** GET /users — paginated, filterable user list */
  getUsers: async (params?: UsersQueryParams): Promise<UserListResponse> => {
    const response = await api.get<unknown>(
      API_ENDPOINTS.USERS.BASE,
      params as Record<string, unknown>
    );
    return normalisePaginatedResponse<User>(response, params, 10);
  },

  /** GET /users/:id */
  getUserById: (id: string): Promise<User> =>
    api.get<User>(API_ENDPOINTS.USERS.BY_ID(id)),

  /** POST /users */
  createUser: (data: CreateUserRequest & { confirmPassword?: string }): Promise<User> =>
    api.post<User>(API_ENDPOINTS.USERS.BASE, sanitiseCreateUserPayload(data)),

  /** PATCH /users/:id */
  updateUser: (id: string, data: UpdateUserRequest): Promise<User> =>
    api.patch<User>(API_ENDPOINTS.USERS.BY_ID(id), data),

  /** PATCH /users/:id/status */
  updateUserStatus: (id: string, data: UpdateUserStatusRequest): Promise<User> =>
    api.patch<User>(API_ENDPOINTS.USERS.STATUS(id), data),

  /** DELETE /users/:id */
  deleteUser: (id: string): Promise<void> =>
    api.delete<void>(API_ENDPOINTS.USERS.BY_ID(id)),
};
