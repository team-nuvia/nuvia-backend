import { ACCESS_COOKIE_NAME } from '@common/variable/globals';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication, version: string) => {
  const config = new DocumentBuilder()
    .setTitle('Nuvia API')
    .setDescription('Nuvia API Docs')
    .setVersion(version)
    .addCookieAuth(ACCESS_COOKIE_NAME, {
      type: 'apiKey',
      in: 'cookie',
      // bearerFormat: 'JWT',
      description: 'JWT Authorization header using the Cookie scheme',
    })
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      // extraModels: [
      //   ErrorResponseDto,
      //   CommonResponseDto,
      //   SuccessResponseDto,
      //   NotFoundResponseDto,
      //   ForbiddenResponseDto,
      //   BadRequestResponseDto,
      //   UnauthorizedResponseDto,
      //   InternalServerErrorResponseDto,
      // ],
    });
  SwaggerModule.setup('api-docs', app, documentFactory, {
    jsonDocumentUrl: 'api-docs/json',
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
    },
    // keep auth
    // securityDefinitions: {
    //   bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    // },
    // security: [{ bearerAuth: [] }],
    // keep auth token when reload page
  });
};
