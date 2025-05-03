import { Module } from '@nestjs/common';
import { UserSecretsService } from './user-secrets.service';
import { UserSecretsController } from './user-secrets.controller';

@Module({
  controllers: [UserSecretsController],
  providers: [UserSecretsService],
})
export class UserSecretsModule {}
