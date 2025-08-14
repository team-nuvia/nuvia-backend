import { UserRole, UserRoleList } from '@share/enums/user-role';

export function isRoleAtLeast(userRole: UserRole, minUserRole: UserRole): boolean {
  const allowedRoles = UserRoleList.slice(0, UserRoleList.indexOf(minUserRole) + 1);
  return allowedRoles.indexOf(userRole) >= 0;
}
