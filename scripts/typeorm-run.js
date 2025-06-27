// scripts/typeorm-run.js
const { execSync } = require('child_process');
const path = require('path');

const migrationCommand = process.argv[2]; // 'test' or 'dev'
console.log("🚀 ~ process.argv:", process.argv)
const env = process.argv[3]; // 'test' or 'dev' or 'path'
const env2 = process.argv[4]; // 'test' or 'dev'

const envVars = {
  test: 'NODE_ENV=test',
  dev: 'NODE_ENV=development',
};

const datasource = {
  test: 'src/config/datasource.ts',
  dev: 'src/config/datasource.ts',
};

if (['migration:create', 'migration:generate'].includes(migrationCommand)) {
  const command = `cross-env ${envVars[env2]} RUN_ON=local ts-node -r tsconfig-paths/register --project tsconfig.json ${path.join(path.resolve(), './node_modules/typeorm/cli.js')} -d ${path.join(path.resolve(), datasource[env2])} ${migrationCommand} ${env}`;
  console.log(`[typeorm:${env2}] ${migrationCommand}`);
  execSync(command, { stdio: 'inherit' });
  return;
}

const command = `cross-env ${envVars[env]} RUN_ON=local ts-node -r tsconfig-paths/register --project tsconfig.json ${path.join(path.resolve(), './node_modules/typeorm/cli.js')} -d ${path.join(path.resolve(), datasource[env])} ${migrationCommand}`;
console.log(`[typeorm:${env}] ${migrationCommand}`);
execSync(command, { stdio: 'inherit' });
