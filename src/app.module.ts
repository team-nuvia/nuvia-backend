import { LoggerMiddleware } from '@common/middleware/logger.middleware';
import commonConfig from '@config/common.config';
import secretConfig from '@config/secret.config';
import { typeormConfig } from '@config/typeorm.config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { ErrorCodeModule } from './error-code/error-code.module';
import { LoggerModule } from './logger/logger.module';
import { StaticModule } from './static/static.module';
import { UsersModule } from './users/users.module';
import { UtilModule } from './util/util.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [commonConfig, typeormConfig, secretConfig],
    }),
    AuthModule,
    UtilModule,
    UsersModule,
    CommonModule,
    LoggerModule,
    DatabaseModule,
    StaticModule,
    ErrorCodeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/*api');
    
  }
}
