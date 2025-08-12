import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccess } from './entities/user-access.entity';
import { UserAccessesController } from './user-accesses.controller';
import { UserAccessRepository } from './user-accesses.repository';
import { UserAccessesService } from './user-accesses.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccess])],
  controllers: [UserAccessesController],
  providers: [UserAccessesService, UserAccessRepository],
})
export class UserAccessesModule {}
