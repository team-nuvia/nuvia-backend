import { Subscription } from '@/subscriptions/entities/subscription.entity';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ProfilesModule } from './profiles/profiles.module';
import { UserAccessesModule } from './user-accesses/user-accesses.module';
import { UserSecretsModule } from './user-secrets/user-secrets.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { UserProvider } from './entities/user-provider.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProvider, Subscription]),
    ProfilesModule,
    UserSecretsModule,
    UserAccessesModule,
    RouterModule.register([
      {
        path: 'users',
        module: ProfilesModule,
      },
      {
        path: 'users',
        module: UserSecretsModule,
      },
      {
        path: 'users',
        module: UserAccessesModule,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
