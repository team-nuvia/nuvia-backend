import { UserRole } from '@common/variable/enums';
import {
  DB_NAME,
  DB_PASSWORD,
  DB_USERNAME,
  DEPLOY_VERSION,
  SERVER_VERSION,
} from '@common/variable/environment';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@users/entities/user.entity';
import { execSync } from 'child_process';
import request from 'supertest';
import { App } from 'supertest/types';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppModule } from './../src/app.module';

const dbName = 'test_' + DB_NAME;

function clearTables() {
  const result = execSync(
    `docker exec mysql mysql -u${DB_USERNAME} -p${DB_PASSWORD} -e "SELECT TABLE_NAME tbname FROM information_schema.tables WHERE table_schema = '${dbName}'"`,
  );
  const content = result.toString('utf-8');
  const lines = content.split('\n').slice(1, -1);

  for (const line of lines) {
    execSync(
      `docker exec mysql mysql -u${DB_USERNAME} -p${DB_PASSWORD} -e "DELETE FROM ${dbName}.\`${line}\`"`,
    );
  }
}

const createUserDto = {
    email: 'test@example.com',
    username: '테스트 사용자',
    nickname: '테스터',
    password: 'qweQQ!!1',
    role: UserRole.User,
  };

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  
  const version = [SERVER_VERSION, DEPLOY_VERSION].join('.');
  const users = new Map();

  beforeEach(async () => {
    clearTables();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/version (GET)', () => {
    request(app.getHttpServer())
      .get('/version')
      .expect(200)
      .expect(`V${version}`);
  });

  it('/users (POST)', () => {
    request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('email', createUserDto.email);
        expect(res.body).toHaveProperty('username', createUserDto.username);
        expect(res.body).toHaveProperty('nickname', createUserDto.nickname);
        expect(res.body).toHaveProperty('role', createUserDto.role);
        // expect(res.body).toHaveProperty('password');
      });
  });
});
