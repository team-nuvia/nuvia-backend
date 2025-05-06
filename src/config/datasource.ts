import { DataSource } from 'typeorm';
import { typeormOptions } from './typeorm.config';

const datasource = new DataSource(typeormOptions);

export default datasource;
