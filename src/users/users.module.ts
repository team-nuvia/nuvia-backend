import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ProfilesModule } from './profiles/profiles.module';
import { UserSecretsModule } from './user-secrets/user-secrets.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ProfilesModule,
    UserSecretsModule,
    RouterModule.register([
      {
        path: 'users',
        module: ProfilesModule,
      },
      {
        path: 'users',
        module: UserSecretsModule,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
