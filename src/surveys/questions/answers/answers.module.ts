import { Module } from '@nestjs/common';
import { AnswersController } from './answers.controller';
import { AnswersRepository } from './answers.repository';
import { AnswersService } from './answers.service';

@Module({
  controllers: [AnswersController],
  providers: [AnswersService, AnswersRepository],
})
export class AnswersModule {}
