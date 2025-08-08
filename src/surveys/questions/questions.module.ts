import { Module } from '@nestjs/common';
import { AnswersModule } from './answers/answers.module';
import { OptionsModule } from './options/options.module';
import { QuestionsService } from './questions.service';

@Module({
  imports: [AnswersModule, OptionsModule],
  controllers: [],
  providers: [QuestionsService],
})
export class QuestionsModule {}
