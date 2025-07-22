export const UserRole = {
  User: 1,
  Manager: 2,
  Master: 3,
  Admin: 4,
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
