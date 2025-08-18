import { Injectable } from '@nestjs/common';
import { AnswersRepository } from './answers.repository';
import { CreateAnswerPayloadDto } from './dto/payload/create-answer.payload.dto';
import { StartAnswerPayloadDto } from './dto/payload/start-answer.payload.dto';
import { StartAnswerNestedResponseDto } from './dto/response/start-answer.nested.response.dto';

@Injectable()
export class AnswersService {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async startAnswer(surveyId: number, startAnswerPayloadDto: StartAnswerPayloadDto, userId?: number): Promise<StartAnswerNestedResponseDto> {
    return this.answersRepository.startAnswer(surveyId, startAnswerPayloadDto, userId);
  }

  async validateFirstSurveyAnswer(submissionHash: string, jws: string, surveyId: number): Promise<void> {
    await this.answersRepository.validateFirstSurveyAnswer(submissionHash, jws, surveyId);
  }

  async create(createAnswerDto: CreateAnswerPayloadDto, surveyId: number, submissionHash: string, userId?: number) {
    await this.answersRepository.createAnswer(createAnswerDto, surveyId, submissionHash, userId);
  }
}
