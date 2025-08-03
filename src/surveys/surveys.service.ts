import { Injectable } from '@nestjs/common';
import { CreateSurveyPayloadDto } from './dto/payload/create-survey.payload.dto';
import { SurveysRepository } from './surveys.repository';

@Injectable()
export class SurveysService {
  constructor(private readonly surveyRepository: SurveysRepository) {}

  async createSurvey(createSurveyPayloadDto: CreateSurveyPayloadDto) {
    await this.surveyRepository.createSurvey(createSurveyPayloadDto);
  }
}
