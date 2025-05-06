import { DEPLOY_VERSION, SERVER_VERSION } from '@common/variable/environment';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { beforeEach, describe, it } from 'vitest';
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

  it('/version (GET)', () => {
    const version = [SERVER_VERSION, DEPLOY_VERSION].join('.');
    return request(app.getHttpServer())
      .get('/version')
      .expect(200)
      .expect(`V${version}`);
  });
});
