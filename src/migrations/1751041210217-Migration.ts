import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751041210217 implements MigrationInterface {
    name = 'Migration1751041210217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_secret\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT '사용자 비밀키 PK', \`user_id\` int NOT NULL COMMENT '사용자 PK', \`password\` varchar(200) NOT NULL COMMENT '사용자 비밀번호', \`salt\` varchar(200) NOT NULL COMMENT '사용자 솔트', \`iteration\` int UNSIGNED NOT NULL COMMENT '반복 횟수', \`created_at\` datetime(6) NOT NULL COMMENT '생성일시' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '수정일시' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL COMMENT '삭제일시', UNIQUE INDEX \`REL_b17d0aebfe1b9f5e0b0a9f5320\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`profile\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT '프로필 PK', \`user_id\` int NOT NULL COMMENT '사용자 PK', \`originalname\` varchar(200) NOT NULL COMMENT '원본 파일 이름', \`filename\` varchar(200) NOT NULL COMMENT '파일 이름', \`mimetype\` varchar(20) NOT NULL COMMENT '파일 타입', \`size\` int NOT NULL COMMENT '파일 사이즈', \`width\` int NOT NULL COMMENT '이미지 너비', \`height\` int NOT NULL COMMENT '이미지 높이', \`buffer\` mediumblob NOT NULL COMMENT '파일 바이트', \`created_at\` datetime(6) NOT NULL COMMENT '생성일시' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '수정일시' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL COMMENT '삭제일시', UNIQUE INDEX \`REL_d752442f45f258a8bdefeebb2f\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT '사용자 PK', \`email\` varchar(50) NOT NULL COMMENT '이메일', \`username\` varchar(50) NOT NULL, \`nickname\` varchar(50) NOT NULL, \`role\` varchar(50) NOT NULL, \`created_at\` datetime(6) NOT NULL COMMENT '생성일시' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '수정일시' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL COMMENT '삭제일시', UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_secret\` ADD CONSTRAINT \`FK_b17d0aebfe1b9f5e0b0a9f5320c\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`profile\` ADD CONSTRAINT \`FK_d752442f45f258a8bdefeebb2f2\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`profile\` DROP FOREIGN KEY \`FK_d752442f45f258a8bdefeebb2f2\``);
        await queryRunner.query(`ALTER TABLE \`user_secret\` DROP FOREIGN KEY \`FK_b17d0aebfe1b9f5e0b0a9f5320c\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`REL_d752442f45f258a8bdefeebb2f\` ON \`profile\``);
        await queryRunner.query(`DROP TABLE \`profile\``);
        await queryRunner.query(`DROP INDEX \`REL_b17d0aebfe1b9f5e0b0a9f5320\` ON \`user_secret\``);
        await queryRunner.query(`DROP TABLE \`user_secret\``);
    }

}
