export const PlanNameType = {
  Free: 'free',
  Basic: 'basic',
  Premium: 'premium',
  // Enterprise: 'enterprise',
} as const;
export type PlanNameType = (typeof PlanNameType)[keyof typeof PlanNameType];
