import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { AnswersRepository } from './answers.repository';
import { CreateAnswerPayloadDto } from './dto/payload/create-answer.payload.dto';
import { StartAnswerPayloadDto } from './dto/payload/start-answer.payload.dto';
import { StartAnswerNestedResponseDto } from './dto/response/start-answer.nested.response.dto';
import { ValidateFirstSurveyAnswerNestedResponseDto } from './dto/response/validate-first-survey-answer.nested.response.dto';

@Injectable()
export class AnswersService {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async startAnswer(surveyId: number, startAnswerPayloadDto: StartAnswerPayloadDto, realIp: IpAddress, userId?: number): Promise<StartAnswerNestedResponseDto> {
    return this.answersRepository.startAnswer(surveyId, startAnswerPayloadDto, realIp, userId);
  }

  async refreshAnswer(surveyId: number, submissionHash: string, res: Response) {
    return this.answersRepository.refreshAnswer(surveyId, submissionHash, res);
  }

  async validateFirstSurveyAnswer(
    submissionHash: string,
    jws: string,
    surveyId: number,
    res: Response,
  ): Promise<ValidateFirstSurveyAnswerNestedResponseDto> {
    return this.answersRepository.validateFirstSurveyAnswer(submissionHash, jws, surveyId, res);
  }

  async createAnswer(
    createAnswerDto: CreateAnswerPayloadDto,
    surveyId: number,
    submissionHash: string,
    res: Response,
    userId?: number,
    transferedFiles?: Express.Multer.File[],
  ) {
    await this.answersRepository.createAnswer(createAnswerDto, surveyId, submissionHash, res, userId, transferedFiles);
  }
}
