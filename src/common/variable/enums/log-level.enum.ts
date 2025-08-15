export const LogLevel = {
  Log: 'log',
  Info: 'info',
  Debug: 'debug',
  Warn: 'warn',
  Error: 'error',
} as const;
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];
export const LogLevels = Object.values(LogLevel);
