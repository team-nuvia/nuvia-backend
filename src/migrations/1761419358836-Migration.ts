import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1761419358836 implements MigrationInterface {
    name = 'Migration1761419358836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reference_buffer\` DROP FOREIGN KEY \`FK_53d937506168db89ab8f00ff59b\``);
        await queryRunner.query(`ALTER TABLE \`question_answer\` DROP FOREIGN KEY \`FK_07f6bc3aca812328261b58336e3\``);
        await queryRunner.query(`ALTER TABLE \`subscription\` ADD \`response_format\` varchar(45) NOT NULL COMMENT '응답 렌더 타입' DEFAULT 'slide'`);
        await queryRunner.query(`ALTER TABLE \`reference_buffer\` ADD CONSTRAINT \`FK_53d937506168db89ab8f00ff59b\` FOREIGN KEY (\`question_answer_id\`) REFERENCES \`question_answer\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`question_answer\` ADD CONSTRAINT \`FK_07f6bc3aca812328261b58336e3\` FOREIGN KEY (\`answer_id\`) REFERENCES \`answer\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`question_answer\` DROP FOREIGN KEY \`FK_07f6bc3aca812328261b58336e3\``);
        await queryRunner.query(`ALTER TABLE \`reference_buffer\` DROP FOREIGN KEY \`FK_53d937506168db89ab8f00ff59b\``);
        await queryRunner.query(`ALTER TABLE \`subscription\` DROP COLUMN \`response_format\``);
        await queryRunner.query(`ALTER TABLE \`question_answer\` ADD CONSTRAINT \`FK_07f6bc3aca812328261b58336e3\` FOREIGN KEY (\`answer_id\`) REFERENCES \`answer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reference_buffer\` ADD CONSTRAINT \`FK_53d937506168db89ab8f00ff59b\` FOREIGN KEY (\`question_answer_id\`) REFERENCES \`question_answer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
