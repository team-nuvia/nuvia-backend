import { Injectable } from '@nestjs/common';
import { AnswersRepository } from './answers.repository';
import { CreateAnswerPayloadDto } from './dto/payload/create-answer.payload.dto';

@Injectable()
export class AnswersService {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async create(createAnswerDto: CreateAnswerPayloadDto, surveyId: number, userId?: number) {
    await this.answersRepository.createAnswer(createAnswerDto, surveyId, userId);
  }
}
