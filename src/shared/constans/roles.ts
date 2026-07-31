/**
 * User role constants.
 * Prefer over raw string literals:
 *   if (role === USER_ROLES.ADMIN)  ✓
 *   if (role === 'ADMIN')           ✗
 */
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
} as const;
