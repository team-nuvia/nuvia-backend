import { UserRole, UserRoleList } from '@share/enums/user-role';

export function isRoleAtLeast(userRole: UserRole, minUserRole: UserRole): boolean {
  console.log('🚀 ~ isRoleAtLeast ~ userRole:', userRole);
  console.log('🚀 ~ isRoleAtLeast ~ minUserRole:', minUserRole);
  const minUserRoleIndex = UserRoleList.indexOf(minUserRole);
  const userRoleIndex = UserRoleList.indexOf(userRole);
  return userRoleIndex >= minUserRoleIndex;
}
