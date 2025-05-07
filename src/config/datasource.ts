import { DataSource } from 'typeorm';
import { datasourceOptions } from './typeorm.config';

const datasource = new DataSource(datasourceOptions);

export default datasource;
