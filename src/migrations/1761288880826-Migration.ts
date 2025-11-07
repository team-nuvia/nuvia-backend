import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1761288880826 implements MigrationInterface {
    name = 'Migration1761288880826';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`answer\` ADD \`real_ip\` varchar(50) NULL COMMENT '실제 IP'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`answer\` DROP COLUMN \`real_ip\``);
    }
}
