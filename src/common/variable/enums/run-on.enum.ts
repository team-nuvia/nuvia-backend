export const RunOn = {
  Local: 'local',
  Cloud: 'cloud',
  Remote: 'remote',
} as const;
export type RunOn = (typeof RunOn)[keyof typeof RunOn];
