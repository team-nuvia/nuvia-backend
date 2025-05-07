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
import { execSync } from 'child_process';
import request from 'supertest';
import { App } from 'supertest/types';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    /* 자동으로 테스트 데이터베이스 제거 */
    execSync(
      `docker exec mysql mysql -u${DB_USERNAME} -p${DB_PASSWORD} -e "drop schema if exists \`test_${DB_NAME}\`"`,
      { stdio: 'pipe' },
    );
  });

  it('/version (GET)', () => {
    const version = [SERVER_VERSION, DEPLOY_VERSION].join('.');
    return request(app.getHttpServer())
      .get('/version')
      .expect(200)
      .expect(`V${version}`);
  });

  it('/users (POST)', () => {
    const createUserDto = {
      email: 'test@example.com',
      username: '테스트 사용자',
      nickname: '테스터',
      password: 'qweQQ!!1',
      role: UserRole.User,
    };

    return request(app.getHttpServer())
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
