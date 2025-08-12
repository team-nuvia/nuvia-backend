export const UserAccessStatusType = {
  Login: 'login',
  Logout: 'logout',
} as const;
export type UserAccessStatusType = (typeof UserAccessStatusType)[keyof typeof UserAccessStatusType];
