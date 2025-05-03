import commonConfig from './common.config';
import { typeormConfig } from './typeorm.config';

export const config = {
  common: commonConfig,
  database: typeormConfig,
} as const;
