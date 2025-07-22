import { CommonService } from '@common/common.service';
import { InputValidationPipe } from '@common/decorator/input-validate-pipe.decorator';
import { GlobalExceptionFilter } from '@common/filter/global-exception.filter';
import { ResponseInterceptor } from '@common/response.interceptor';
import { RunMode } from '@common/variable/enums';
import { LoggerService } from '@logger/logger.service';
import { VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { printRouterInfo } from '@util/printRouterInfo';
import { setupSwagger } from '@util/setupSwagger';
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

  const commonService = app.get(CommonService);
  const loggerService = app.get(LoggerService);
  const commonConfig = commonService.getConfig('common');

  const version = commonConfig.version;
  const port = commonConfig.port;

  app.useGlobalPipes(
    // new ValidationPipe({
    //   whitelist: true,
    //   forbidNonWhitelisted: true,
    //   transform: true,
    //   stopAtFirstError: true,
    //   exceptionFactory(errors) {
    //     const message = errors.shift();
    //     return new BadRequestException({
    //       reason: message?.property ?? ('{{param}}' as StringOrNull),
    //     });
    //   },
    // }),
    InputValidationPipe(),
  );

  app.use(cookieParser());
  app.use(compression());
  app.useLogger(loggerService);
  // app.useLogger(loggerService);

  /* 글로벌 설정 */
  app.useGlobalGuards(new JwtGuard(app.get(Reflector)));
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
  // 컨테이너 설정은 의존성 주입을 위해 필요합니다.
  // AppModule에서 필요한 서비스나 리포지토리를 주입받기 위해 사용됩니다.
  // 자동으로 주입되지 않기 때문에 명시적으로 설정해야 합니다.
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  /* 재시작 구분선 */
  /* 로그 파일에 적용 */
  // loggerService.log('=============================================');
  // loggerService.info('=============================================');
  // loggerService.debug('=============================================');
  // loggerService.warn('=============================================');
  // loggerService.error('=============================================');

  printRouterInfo(app);

  await app.listen(port);
  loggerService.info(`Server listening on http://localhost:${port}`);
}

bootstrap();
