export const RunMode = {
  Development: 'development',
  Test: 'test',
  Production: 'production',
} as const;
export type RunMode = (typeof RunMode)[keyof typeof RunMode];
