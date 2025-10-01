import { CommonService } from '@common/common.service';
import { InputValidationPipe } from '@common/decorator/input-validate-pipe.decorator';
import { GlobalExceptionFilter } from '@common/filter/global-exception.filter';
import { ResponseInterceptor } from '@common/interceptor/response.interceptor';
import { TransactionalInterceptor } from '@common/interceptor/transactional.interceptor';
import { RunMode } from '@common/variable/enums/run-mode.enum';
import { TxRunner } from '@database/tx.runner';
import { LoggerService } from '@logger/logger.service';
import { VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { printRouterInfo } from '@util/printRouterInfo';
import { setupSwagger } from '@util/setupSwagger';
import cluster from 'cluster';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { JwtGuard } from './auth/guard/jwt.guard';
import { CERT_KEY, IS_PROD, PRIV_KEY } from '@common/variable/environment';
import fs from 'fs';

cluster.schedulingPolicy = cluster.SCHED_RR; // Round Robin

async function bootstrap() {
  const cert = CERT_KEY ? fs.readFileSync(CERT_KEY) : null;
  const key = PRIV_KEY ? fs.readFileSync(PRIV_KEY) : null;
  const httpsOptions = {
    key,
    cert,
  };
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    httpsOptions: IS_PROD ? httpsOptions : undefined,
  });

  const commonService = app.get(CommonService);
  const loggerService = app.get(LoggerService);
  const commonConfig = commonService.getConfig('common');

  const version = commonConfig.version;
  const port = commonConfig.port;

  app.useLogger(loggerService);
  app.use(cookieParser());
  app.use(compression());

  app.useGlobalPipes(InputValidationPipe());

  // app.useLogger(loggerService);

  /* 글로벌 설정 */
  app.useGlobalGuards(new JwtGuard(app.get(Reflector)));
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ResponseInterceptor(loggerService), new TransactionalInterceptor(app.get(TxRunner), app.get(Reflector)));
  app.useGlobalFilters(new GlobalExceptionFilter(loggerService));

  /* 버저닝 */
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  /* CORS 설정 */
  app.enableCors({
    // TODO: 운영일 때 호스트 적용
    origin:
      commonConfig.runMode === RunMode.Development
        ? ['http://localhost:5000', 'http://localhost:6006', 'http://127.0.0.1:5000', 'http://127.0.0.1:6006', 'http://localhost:5173']
        : ['https://app.nuvia.kro.kr'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'], // Specify allowed HTTP methods
    credentials: true,
    maxAge: 86400,
  });

  /* Swagger 설정 */
  setupSwagger(app, version);

  /* 컨테이너 설정 */
  // 컨테이너 설정은 의존성 주입을 위해 필요합니다.
  // AppModule에서 필요한 서비스나 리포지토리를 주입받기 위해 사용됩니다.
  // 자동으로 주입되지 않기 때문에 명시적으로 설정해야 합니다.
  // useContainer(app.select(AppModule), { fallbackOnErrors: true });

  /* 재시작 구분선 */
  /* 로그 파일에 적용 */
  // loggerService.log('=============================================');
  // loggerService.info('=============================================');
  // loggerService.debug('=============================================');
  // loggerService.warn('=============================================');
  // loggerService.error('=============================================');

  await app.listen(port);

  printRouterInfo(app);

  loggerService.info(`Server listening on http://localhost:${port}`);
}

bootstrap();
