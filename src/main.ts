import { CommonService } from '@common/common.service';
import { GlobalExceptionFilter } from '@common/filter/global-exception.filter';
import { ResponseInterceptor } from '@common/response.interceptor';
import { RunMode } from '@common/variable/enums';
import { LoggerService } from '@logger/logger.service';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupSwagger } from '@util/setupSwagger';
import { UtilService } from '@util/util.service';
import { useContainer } from 'class-validator';
import cluster from 'cluster';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { JwtGuard } from './auth/jwt.guard';

cluster.schedulingPolicy = cluster.SCHED_RR; // Round Robin

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const utilService = app.get(UtilService);
  const commonService = app.get(CommonService);
  const loggerService = app.get(LoggerService);
  const commonConfig = commonService.getConfig('common');

  const version = commonConfig.version;
  const port = commonConfig.port;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  app.use(cookieParser());
  app.use(compression());
  app.useLogger(loggerService);

  /* 글로벌 설정 */
  app.useGlobalGuards(new JwtGuard(utilService));
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ResponseInterceptor(loggerService));
  app.useGlobalFilters(new GlobalExceptionFilter(loggerService));

  /* 버저닝 */
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  /* CORS 설정 */
  app.enableCors({
    // TODO: 운영일 때 호스트 적용
    origin: commonConfig.runMode === RunMode.Development ? '*' : '*',
    credentials: commonConfig.runMode === RunMode.Production,
  });

  /* Swagger 설정 */
  setupSwagger(app, version);

  /* 컨테이너 설정 */
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  /* 재시작 구분선 */
  /* 로그 파일에 적용 */
  loggerService.log('=============================================');
  loggerService.info('=============================================');
  loggerService.debug('=============================================');
  loggerService.warn('=============================================');
  loggerService.error('=============================================');

  await app.listen(port);
  loggerService.log(`Server listening on http://localhost:${port}`);
}

bootstrap();
