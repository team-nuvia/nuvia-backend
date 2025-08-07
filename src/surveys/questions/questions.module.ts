import { Module } from '@nestjs/common';
import { AnswersModule } from './answers/answers.module';
import { OptionsModule } from './options/options.module';
import { QuestionsService } from './questions.service';

@Module({
  controllers: [],
  providers: [QuestionsService],
  imports: [AnswersModule, OptionsModule],
})
export class QuestionsModule {}
