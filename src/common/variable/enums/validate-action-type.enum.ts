export const ValidateActionType = {
  Read: 'read',
  Create: 'create',
  Update: 'update',
  Delete: 'delete',
} as const;
export type ValidateActionType = (typeof ValidateActionType)[keyof typeof ValidateActionType];
