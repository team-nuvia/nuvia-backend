import { Injectable } from '@nestjs/common';
import { SurveySearchQueryParamDto } from './dto/param/survey-search-query.param.dto';
import { CreateSurveyPayloadDto } from './dto/payload/create-survey.payload.dto';
import { UpdateSurveyPayloadDto } from './dto/payload/update-survey.payload.dto';
import { DashboardSurveyNestedResponseDto } from './dto/response/dashboard-survey.nested.response.dto';
import { SurveysRepository } from './surveys.repository';

@Injectable()
export class SurveysService {
  constructor(private readonly surveyRepository: SurveysRepository) {}

  async createSurvey(userId: number, createSurveyPayloadDto: CreateSurveyPayloadDto): Promise<void> {
    await this.surveyRepository.createSurvey(userId, createSurveyPayloadDto);
  }

  async getSurvey(userId: number, searchQuery: SurveySearchQueryParamDto): Promise<DashboardSurveyNestedResponseDto[]> {
    return await this.surveyRepository.getSurvey(userId, searchQuery);
  }

  async updateSurvey(id: number, updateSurveyPayloadDto: UpdateSurveyPayloadDto): Promise<void> {
    await this.surveyRepository.updateSurvey(id, updateSurveyPayloadDto);
  }
}
