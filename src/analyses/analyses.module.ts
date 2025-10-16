import { Survey } from '@/surveys/entities/survey.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalysesController } from './analyses.controller';
import { AnalysesRepository } from './analyses.repository';
import { AnalysesService } from './analyses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Survey])],
  controllers: [AnalysesController],
  providers: [AnalysesService, AnalysesRepository],
})
export class AnalysesModule {}
