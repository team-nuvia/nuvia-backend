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

  async continueAnswer(
    surveyId: number,
    startAnswerPayloadDto: StartAnswerPayloadDto,
    realIp: IpAddress,
    submissionHash: string,
    jws: string,
    res: Response,
    userId?: number,
  ) {
    await this.answersRepository.continueAnswer(surveyId, startAnswerPayloadDto, realIp, submissionHash, jws, res, userId);
  }

  async startAnswer(
    surveyId: number,
    startAnswerPayloadDto: StartAnswerPayloadDto,
    realIp: IpAddress,
    userId?: number,
  ): Promise<StartAnswerNestedResponseDto> {
    return this.answersRepository.startAnswer(surveyId, startAnswerPayloadDto, realIp, userId);
  }

  async refreshAnswer(surveyId: number, submissionHash: string, realIp: IpAddress, res: Response, userId?: number) {
    return this.answersRepository.refreshAnswer(surveyId, submissionHash, realIp, res, userId);
  }

  async validateFirstSurveyAnswer(
    submissionHash: string,
    jws: string,
    surveyId: number,
    realIp: IpAddress,
    res: Response,
    userId?: number,
  ): Promise<ValidateFirstSurveyAnswerNestedResponseDto> {
    return this.answersRepository.validateFirstSurveyAnswer(submissionHash, jws, surveyId, realIp, res, userId);
  }

  async createAnswer(
    createAnswerDto: CreateAnswerPayloadDto,
    surveyId: number,
    submissionHash: string,
    res: Response,
    realIp: IpAddress,
    userId?: number,
    transferedFiles?: Express.Multer.File[],
  ) {
    await this.answersRepository.createAnswer(createAnswerDto, surveyId, submissionHash, res, realIp, userId, transferedFiles);
  }
}
