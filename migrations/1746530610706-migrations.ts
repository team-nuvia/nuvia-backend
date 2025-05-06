import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1746530610706 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.createDatabase(['test', DB_NAME].join('_'), true);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
