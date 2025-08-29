import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { OrganizationRolesModule } from './organization-roles/organization-roles.module';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsRepository } from './subscriptions.repository';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [
    OrganizationRolesModule,
    RouterModule.register([
      {
        path: 'subscriptions',
        module: OrganizationRolesModule,
      },
    ]),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, SubscriptionsRepository],
})
export class SubscriptionsModule {}
