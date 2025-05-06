export const LogLevel = {
  Log: 'log',
  Info: 'info',
  Debug: 'debug',
  Warn: 'warn',
  Error: 'error',
} as const;
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];
export const LogLevels = Object.values(LogLevel);

export const RunOn = {
  Local: 'local',
  Cloud: 'cloud',
  Remote: 'remote',
} as const;
export type RunOn = (typeof RunOn)[keyof typeof RunOn];

export const RunMode = {
  Development: 'development',
  Test: 'test',
  Production: 'production',
} as const;
export type RunMode = (typeof RunMode)[keyof typeof RunMode];

export const RequestMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
} as const;
export type RequestMethod = (typeof RequestMethod)[keyof typeof RequestMethod];

export const UserRole = {
  User: 1,
  Manager: 2,
  Master: 3,
  Admin: 4,
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/* Test Values */
export const sample = {
  username: {
    first: [
      '유별난',
      '다채로운',
      '활발한',
      '다정다감한',
      '기능적인',
      '환상적인',
      '눈에띄는',
      '감상적인',
      '조화로운',
      '발랄한',
      '따사로운',
      '냉소적인',
    ],
    last: [
      '지우개',
      '분필',
      '필통',
      '책꽂이',
      '책받침',
      '모나미펜',
      '제도샤프',
      '유성매직',
      '만년필',
      '네임펜',
      '화이트',
      '눈금자',
      '삼각자',
      '이젤',
      '화통',
    ],
  },
};
