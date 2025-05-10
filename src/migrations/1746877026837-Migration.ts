import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1746877026837 implements MigrationInterface {
    name = 'Migration1746877026837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`profile\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT '프로필 PK', \`user_id\` int NOT NULL COMMENT '사용자 PK', \`originalname\` varchar(200) NOT NULL COMMENT '원본 파일 이름', \`filename\` varchar(200) NOT NULL COMMENT '파일 이름', \`mimetype\` varchar(20) NOT NULL COMMENT '파일 타입', \`size\` int NOT NULL COMMENT '파일 사이즈', \`width\` int NOT NULL COMMENT '이미지 너비', \`height\` int NOT NULL COMMENT '이미지 높이', \`buffer\` mediumblob NOT NULL COMMENT '파일 바이트', \`created_at\` datetime(6) NOT NULL COMMENT '생성일시' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '수정일시' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL COMMENT '삭제일시', UNIQUE INDEX \`REL_d752442f45f258a8bdefeebb2f\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_secret\` ADD \`created_at\` datetime(6) NOT NULL COMMENT '생성일시' DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user_secret\` ADD \`updated_at\` datetime(6) NOT NULL COMMENT '수정일시' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user_secret\` ADD \`deleted_at\` datetime(6) NULL COMMENT '삭제일시'`);
        await queryRunner.query(`ALTER TABLE \`user_secret\` DROP FOREIGN KEY \`FK_b17d0aebfe1b9f5e0b0a9f5320c\``);
        await queryRunner.query(`ALTER TABLE \`user_secret\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT COMMENT '사용자 비밀키 PK'`);
        await queryRunner.query(`ALTER TABLE \`user_secret\` CHANGE \`user_id\` \`user_id\` int NOT NULL COMMENT '사용자 PK'`);
        await queryRunner.query(`ALTER TABLE \`user_secret\` CHANGE \`password\` \`password\` varchar(200) NOT NULL COMMENT '사용자 비밀번호'`);
        await queryRunner.query(`ALTER TABLE \`user_secret\` CHANGE \`salt\` \`salt\` varchar(200) NOT NULL COMMENT '사용자 솔트'`);
        await queryRunner.query(`ALTER TABLE \`user_secret\` CHANGE \`iteration\` \`iteration\` int UNSIGNED NOT NULL COMMENT '반복 횟수'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT COMMENT '사용자 PK'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`email\` \`email\` varchar(50) NOT NULL COMMENT '이메일'`);
        await queryRunner.query(`ALTER TABLE \`user_secret\` ADD CONSTRAINT \`FK_b17d0aebfe1b9f5e0b0a9f5320c\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`profile\` ADD CONSTRAINT \`FK_d752442f45f258a8bdefeebb2f2\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`profile\` DROP FOREIGN KEY \`FK_d752442f45f258a8bdefeebb2f2\``);
        await queryRunner.query(`ALTER TABLE \`user_secret\` DROP FOREIGN KEY \`FK_b17d0aebfe1b9f5e0b0a9f5320c\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`email\` \`email\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`user_secret\` CHANGE \`iteration\` \`iteration\` int UNSIGNED NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_secret\` CHANGE \`salt\` \`salt\` varchar(200) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_secret\` CHANGE \`password\` \`password\` varchar(200) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_secret\` CHANGE \`user_id\` \`user_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_secret\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`user_secret\` ADD CONSTRAINT \`FK_b17d0aebfe1b9f5e0b0a9f5320c\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_secret\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`user_secret\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`user_secret\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`DROP INDEX \`REL_d752442f45f258a8bdefeebb2f\` ON \`profile\``);
        await queryRunner.query(`DROP TABLE \`profile\``);
    }

}
