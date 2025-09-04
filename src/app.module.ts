import { LoggerMiddleware } from '@common/middleware/logger.middleware';
import { PrometheusMiddleware } from '@common/middleware/prometheus.middleware';
import commonConfig from '@config/common.config';
import emailConfig from '@config/email.config';
import secretConfig from '@config/secret.config';
import { typeormConfig } from '@config/typeorm.config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersRepository } from '@users/users.repository';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BatchesModule } from './batches/batches.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { EmailsModule } from './emails/emails.module';
import { ErrorCodeModule } from './error-code/error-code.module';
import { LoggerModule } from './logger/logger.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PlansModule } from './plans/plans.module';
import { StaticModule } from './static/static.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SurveysModule } from './surveys/surveys.module';
import { UsersModule } from './users/users.module';
import { UtilModule } from './util/util.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [commonConfig, typeormConfig, secretConfig, emailConfig],
    }),
    AuthModule,
    UtilModule,
    PlansModule,
    UsersModule,
    CommonModule,
    LoggerModule,
    StaticModule,
    BatchesModule,
    SurveysModule,
    DatabaseModule,
    ErrorCodeModule,
    PaymentsModule,
    PermissionsModule,
    SubscriptionsModule,
    EmailsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersRepository],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/*api');
    consumer.apply(PrometheusMiddleware).forRoutes('/*api');
  }
}
