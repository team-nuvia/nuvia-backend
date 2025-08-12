import { ForbiddenAccessExceptionDto } from '@common/dto/exception/forbidden-access.exception.dto';
import { Injectable } from '@nestjs/common';
import { NotFoundSurveyExceptionDto } from './dto/exception/not-found-survey.exception.dto';
import { SurveySearchQueryParamDto } from './dto/param/survey-search-query.param.dto';
import { CreateSurveyPayloadDto } from './dto/payload/create-survey.payload.dto';
import { UpdateSurveyVisibilityPayloadDto } from './dto/payload/update-survey-visibility.payload.dto';
import { UpdateSurveyPayloadDto } from './dto/payload/update-survey.payload.dto';
import { DashboardRecentSurveyNestedResponseDto } from './dto/response/dashboard-recent-survey.nested.response.dto';
import { DashboardSurveryMetadataNestedResponseDto } from './dto/response/dashboard-survery-metadata.nested.dto';
import { DashboardSurveyNestedResponseDto } from './dto/response/dashboard-survey.nested.response.dto';
import { ListResponseDto } from './dto/response/get-survey-list.response.dto';
import { SurveyDetailNestedResponseDto } from './dto/response/survey-detail.nested.response.dto';
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

  async getSurveyList(userId: number, searchQuery: SurveySearchQueryParamDto): Promise<ListResponseDto> {
    return await this.surveyRepository.getSurveyList(userId, searchQuery);
  }

  async getSurveyMetadata(userId: number): Promise<DashboardSurveryMetadataNestedResponseDto> {
    return await this.surveyRepository.getSurveyMetadata(userId);
  }

  async getRecentSurvey(userId: number): Promise<DashboardRecentSurveyNestedResponseDto[]> {
    return await this.surveyRepository.getRecentSurvey(userId);
  }

  async getSurveyDetail(surveyId: number): Promise<SurveyDetailNestedResponseDto> {
    await this.surveyRepository.viewCountUpdate(surveyId);
    return await this.surveyRepository.getSurveyDetail(surveyId);
  }

  async toggleSurveyVisibility(userId: number, surveyId: number, updateSurveyVisibilityPayloadDto: UpdateSurveyVisibilityPayloadDto): Promise<void> {
    const survey = await this.surveyRepository.getSurveyDetail(surveyId, userId);

    if (!survey) {
      throw new NotFoundSurveyExceptionDto();
    }

    // TODO: 권한 체크 로직 변경 (동일 조직인지 확인)
    // TODO: Editor 이상 권한인지 확인
    if (survey.author?.id !== userId) {
      throw new ForbiddenAccessExceptionDto();
    }

    await this.surveyRepository.toggleSurveyVisibility(surveyId, updateSurveyVisibilityPayloadDto);
  }

  async updateSurvey(id: number, updateSurveyPayloadDto: UpdateSurveyPayloadDto): Promise<void> {
    await this.surveyRepository.updateSurvey(id, updateSurveyPayloadDto);
  }

  async deleteSurvey(userId: number, surveyId: number): Promise<void> {
    const survey = await this.surveyRepository.getSurveyDetail(surveyId, userId);

    if (!survey) {
      throw new NotFoundSurveyExceptionDto();
    }

    if (survey.author?.id !== userId) {
      throw new ForbiddenAccessExceptionDto();
    }

    await this.surveyRepository.deleteSurvey(surveyId, userId);
  }
}
