import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserSecret } from './entities/user-secret.entity';
import { UserSecretsController } from './user-secrets.controller';
import { UserSecretsService } from './user-secrets.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSecret])],
  controllers: [UserSecretsController],
  providers: [UserSecretsService],
})
export class UserSecretsModule {}
