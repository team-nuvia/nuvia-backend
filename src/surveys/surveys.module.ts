import { Module } from '@nestjs/common';
import { QuestionsModule } from './questions/questions.module';
import { SurveysController } from './surveys.controller';
import { SurveysRepository } from './surveys.repository';
import { SurveysService } from './surveys.service';

@Module({
  imports: [QuestionsModule],
  controllers: [SurveysController],
  providers: [SurveysService, SurveysRepository],
})
export class SurveysModule {}
