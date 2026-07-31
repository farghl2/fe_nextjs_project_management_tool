/**
 * User domain types.
 * Re-exported from the shared contract layer so existing component imports
 * continue to work without modification.
 */
export type {
  User,
  UserRole,
  UserSortBy,
  UserListResponse,
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserStatusRequest,
  UsersQueryParams,
  SortOrder,
} from '@/src/shared/types/api.types';

// ─── Legacy aliases kept for backward compatibility ───────────────────────────

/** @deprecated Use User from @/src/shared/types/api.types */
export type UserItem = import('@/src/shared/types/api.types').User;

/** @deprecated Use UserListResponse from @/src/shared/types/api.types */
export type UsersPaginatedResponse = import('@/src/shared/types/api.types').UserListResponse;
