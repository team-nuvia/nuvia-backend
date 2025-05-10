import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '@users/profiles/entities/profile.entity';
import { StaticController } from './static.controller';
import { StaticService } from './static.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [StaticController],
  providers: [StaticService],
})
export class StaticModule {}
