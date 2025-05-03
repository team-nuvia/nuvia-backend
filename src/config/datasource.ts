import { DataSource } from 'typeorm';
import { typeormOptions } from './typeorm.config';

export const datasource = new DataSource(typeormOptions);
