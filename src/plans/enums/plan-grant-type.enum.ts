export const PlanGrantType = {
  Limit: 'limit',
  Allow: 'allow',
} as const;
export type PlanGrantType = (typeof PlanGrantType)[keyof typeof PlanGrantType];