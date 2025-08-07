import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { Question } from './questions/entities/question.entity';
import { QuestionOption } from './questions/options/entities/question-option.entity';
import { QuestionsModule } from './questions/questions.module';
import { SurveysController } from './surveys.controller';
import { SurveysRepository } from './surveys.repository';
import { SurveysService } from './surveys.service';

@Module({
  imports: [TypeOrmModule.forFeature([Survey, Question, QuestionOption]), QuestionsModule],
  controllers: [SurveysController],
  providers: [SurveysService, SurveysRepository],
})
export class SurveysModule {}
