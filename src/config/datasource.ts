import { DataSource } from 'typeorm';
import { datasourceOptions } from './typeorm.config';

const AppDataSource = new DataSource(datasourceOptions);
AppDataSource
  .initialize()
  .then(() => {
    console.log('✅ DataSource initialized');
  })
  .catch((err) => {
    console.error('❌ DataSource intiialization failed', err);
  });
export default AppDataSource;
