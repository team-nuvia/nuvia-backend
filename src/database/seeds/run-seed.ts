import { datasourceOptions } from '@config/typeorm.config';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
// import AppDataSource from '../../config/datasource';

const dataSource = new DataSource({ ...datasourceOptions, migrationsRun: false });

dataSource.initialize().then(async () => {
  await runSeeders(dataSource);
  process.exit();
});
