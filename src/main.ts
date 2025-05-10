import { CommonService } from '@common/common.service';
import {
  BadRequestResponseDto,
  CommonResponseDto,
  NotFoundResponseDto,
  OkResponseDto,
  UnauthorizedResponseDto,
} from '@common/dto/response.dto';
import { GlobalExceptionFilter } from '@common/filter/global-exception.filter';
import { ResponseInterceptor } from '@common/response.interceptor';
import { RunMode } from '@common/variable/enums';
import { LoggerService } from '@logger/logger.service';
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  /* 재시작 구분선 */
  loggerService.log('=============================================');
  loggerService.info('=============================================');
  loggerService.debug('=============================================');
  loggerService.warn('=============================================');
  loggerService.error('=============================================');

  const version = commonConfig.version;
  const port = commonConfig.port;

  app.use(cookieParser());
  app.use(compression());
  app.useLogger(loggerService);

  app.useGlobalGuards(new JwtGuard(utilService));
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ResponseInterceptor(loggerService));
  app.useGlobalFilters(new GlobalExceptionFilter(loggerService));

  app.enableVersioning({ type: VersioningType.URI });
  app.enableCors({
    origin: commonConfig.runMode === RunMode.Development ? '*' : '*',
    credentials: commonConfig.runMode === RunMode.Production,
  });

  const config = new DocumentBuilder()
    .setTitle('NestJS + TypeORM Seed Template')
    .setDescription('NestJS + TypeORM Seed Template API Docs')
    .setVersion(version)
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      extraModels: [
        CommonResponseDto,
        OkResponseDto,
        NotFoundResponseDto,
        BadRequestResponseDto,
        UnauthorizedResponseDto,
      ],
    });
  SwaggerModule.setup('api-docs', app, documentFactory, {
    jsonDocumentUrl: 'api-docs/json',
    swaggerOptions: {
      docExpansion: 'none',
    },
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(port);
  loggerService.log(`Server listening on http://localhost:${port}`);
}

bootstrap();
