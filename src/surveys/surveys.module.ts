import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AnswersModule } from './questions/answers/answers.module';
import { QuestionsModule } from './questions/questions.module';
import { SurveysController } from './surveys.controller';
import { SurveysRepository } from './surveys.repository';
import { SurveysService } from './surveys.service';

@Module({
  imports: [QuestionsModule, RouterModule.register([{ path: 'surveys', module: AnswersModule }])],
  controllers: [SurveysController],
  providers: [SurveysService, SurveysRepository],
})
export class SurveysModule {}
