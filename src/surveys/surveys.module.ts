import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionOption } from './entities/question-option.entity';
import { Question } from './entities/question.entity';
import { Survey } from './entities/survey.entity';
import { SurveysController } from './surveys.controller';
import { SurveysRepository } from './surveys.repository';
import { SurveysService } from './surveys.service';

@Module({
  imports: [TypeOrmModule.forFeature([Survey, Question, QuestionOption])],
  controllers: [SurveysController],
  providers: [SurveysService, SurveysRepository],
})
export class SurveysModule {}
