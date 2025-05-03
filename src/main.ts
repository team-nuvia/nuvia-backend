import { CommonService } from '@common/common.service';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerService } from '@logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const loggerService = app.get(LoggerService);
  const commonService = app.get(CommonService);
  const commonConfig = commonService.getConfig('common');

  const version = commonConfig.version;
  const port = commonConfig.port;

  app.useLogger(loggerService);

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion(version)
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port);
}
bootstrap();
