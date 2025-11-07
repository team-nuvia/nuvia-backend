import { CommonService } from '@common/common.service';
import { InputValidationPipe } from '@common/decorator/input-validate-pipe.decorator';
import { GlobalExceptionFilter } from '@common/filter/global-exception.filter';
import { ResponseInterceptor } from '@common/interceptor/response.interceptor';
import { TransactionalInterceptor } from '@common/interceptor/transactional.interceptor';
import { RunMode } from '@common/variable/enums/run-mode.enum';
import { RunOn } from '@common/variable/enums/run-on.enum';
import { CERT_KEY, PRIV_KEY } from '@common/variable/environment';
import { SWAGGER_AUTH_COOKIE_NAME } from '@common/variable/globals';
import { TxRunner } from '@database/tx.runner';
import { LoggerService } from '@logger/logger.service';
import { VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { decryptSwagger } from '@util/encrypt';
import { isNil } from '@util/isNil';
import { printRouterInfo } from '@util/printRouterInfo';
import { setupSwagger } from '@util/setupSwagger';
import cluster from 'cluster';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import ejs from 'ejs';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { AppModule } from './app.module';
import { JwtGuard } from './auth/guard/jwt.guard';

cluster.schedulingPolicy = cluster.SCHED_RR; // Round Robin

const swaggerMap = new Map<
  string,
  {
    count: number;
    lastFailedLogin: Date;
  }
>();

async function bootstrap() {
  const cert = CERT_KEY ? fs.readFileSync(CERT_KEY) : null;
  const key = PRIV_KEY ? fs.readFileSync(PRIV_KEY) : null;
  const httpsOptions = {
    key,
    cert,
  };
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    httpsOptions: !isNil(cert) && !isNil(key) ? httpsOptions : undefined,
  });

  const commonService = app.get(CommonService);
  const loggerService = app.get(LoggerService);
  const commonConfig = commonService.getConfig('common');

  const version = commonConfig.version;
  const host = commonConfig.host;
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
      commonConfig.runMode === RunMode.Development || commonConfig.runOn === RunOn.Local
        ? ['http://localhost:5000', 'https://localhost:5000']
        : ['https://app.nuvia.kro.kr'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'], // Specify allowed HTTP methods
    credentials: true,
    maxAge: 86400,
  });

  /* 스웨거 페이지 보호 */
  /* 5회 입력 오류 시 로그인 제한 */
  /* 3분 후 입력 재시도 허용 */
  app.use('/api-docs', async (req: Request, res: Response, next: NextFunction) => {
    const origin = process.env.SWAGGER_BASIC_AUTH_USER + ':' + process.env.SWAGGER_BASIC_AUTH_PASS;

    const validateIp = swaggerMap.get(req.ip as string);
    if (validateIp && validateIp.count >= 5 && validateIp.lastFailedLogin.getTime() + 1000 * 60 * 3 < Date.now()) {
      swaggerMap.set(req.ip as string, { count: 0, lastFailedLogin: new Date() });
    }

    // if (req.originalUrl !== '/api-docs') {
    //   return next();
    // }

    const auth = req.cookies[SWAGGER_AUTH_COOKIE_NAME];
    if (!auth) {
      const userIpCount = swaggerMap.get(req.ip as string) ?? { count: 0, lastFailedLogin: new Date() };
      const content = await ejs.renderFile(path.join(path.resolve(), 'src', 'util', 'template', 'login-required.ejs'), {
        invalidLogin: userIpCount.count > 0,
        userIpCount,
      });
      res.clearCookie(SWAGGER_AUTH_COOKIE_NAME);
      return res.status(401).send(content);
    }

    if (decryptSwagger(auth) === origin) {
      swaggerMap.set(req.ip as string, { count: 0, lastFailedLogin: new Date() });
      return next();
    }

    const userIpCount = swaggerMap.get(req.ip as string) ?? { count: 0, lastFailedLogin: new Date() };
    swaggerMap.set(req.ip as string, { count: userIpCount.count + 1, lastFailedLogin: new Date() });
    const content = await ejs.renderFile(path.join(path.resolve(), 'src', 'util', 'template', 'login-required.ejs'), {
      invalidLogin: userIpCount.count > 0,
      userIpCount: swaggerMap.get(req.ip as string) ?? { count: 0, lastFailedLogin: new Date() },
    });
    res.clearCookie(SWAGGER_AUTH_COOKIE_NAME);
    return res.status(401).send(content);
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

  await app.listen(port, host);

  printRouterInfo(app);

  loggerService.info(`Server listening on http://localhost:${port}`);
}

bootstrap();

// pm2 graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});
