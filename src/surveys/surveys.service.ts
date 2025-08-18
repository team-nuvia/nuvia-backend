import { ForbiddenAccessExceptionDto } from '@common/dto/exception/forbidden-access.exception.dto';
import { Injectable } from '@nestjs/common';
import { UserRole } from '@share/enums/user-role';
import { isRoleAtLeast } from '@util/isRoleAtLeast';
import { NotFoundSurveyExceptionDto } from './dto/exception/not-found-survey.exception.dto';
import { SurveyMetadataQueryParamDto } from './dto/param/survey-metadata-query.param.dto';
import { SurveySearchQueryParamDto } from './dto/param/survey-search-query.param.dto';
import { CreateSurveyPayloadDto } from './dto/payload/create-survey.payload.dto';
import { UpdateSurveyStatusPayloadDto } from './dto/payload/update-survey-status.payload.dto';
import { UpdateSurveyVisibilityPayloadDto } from './dto/payload/update-survey-visibility.payload.dto';
import { UpdateSurveyPayloadDto } from './dto/payload/update-survey.payload.dto';
import { DashboardRecentSurveyNestedResponseDto } from './dto/response/dashboard-recent-survey.nested.response.dto';
import { DashboardSurveyNestedResponseDto } from './dto/response/dashboard-survey.nested.response.dto';
import { GetCategoryNestedResponseDto } from './dto/response/get-category.nested.response.dto';
import { GetSurveyBinPaginatedResponseDto } from './dto/response/get-survey-bin.response.dto';
import { ListResponseDto } from './dto/response/get-survey-list.response.dto';
import { MetadataDashboardSurveryNestedResponseDto } from './dto/response/metadata-dashboard-survery.nested.dto';
import { MetadataSurveyListNestedResponseDto } from './dto/response/metadata-survey-list.nested.response.dto';
import { SurveyDetailNestedResponseDto } from './dto/response/survey-detail.nested.response.dto';
import { SurveysRepository } from './surveys.repository';

@Injectable()
export class SurveysService {
  constructor(private readonly surveyRepository: SurveysRepository) {}

  async createSurvey(userId: number, createSurveyPayloadDto: CreateSurveyPayloadDto): Promise<void> {
    const subscription = await this.surveyRepository.getCurrentOrganization(userId);

    if (!isRoleAtLeast(subscription.permission.role, UserRole.Editor)) {
      throw new ForbiddenAccessExceptionDto();
    }

    await this.surveyRepository.createSurvey(subscription.id, userId, createSurveyPayloadDto);
  }

  async restoreSurvey(surveyId: number): Promise<void> {
    await this.surveyRepository.restoreSurvey(surveyId);
  }

  getSurveyCategories(): Promise<GetCategoryNestedResponseDto[]> {
    return this.surveyRepository.getSurveyCategories();
  }

  async getDeletedSurvey(userId: number, searchQuery: SurveySearchQueryParamDto): Promise<GetSurveyBinPaginatedResponseDto> {
    return await this.surveyRepository.getDeletedSurvey(userId, searchQuery);
  }

  async getSurvey(userId: number, searchQuery: SurveySearchQueryParamDto): Promise<DashboardSurveyNestedResponseDto[]> {
    return await this.surveyRepository.getSurvey(userId, searchQuery);
  }

  async getSurveyList(userId: number, searchQuery: SurveySearchQueryParamDto): Promise<ListResponseDto> {
    return await this.surveyRepository.getSurveyList(userId, searchQuery);
  }

  async getSurveyMetadata(
    userId: number,
    searchQuery: SurveyMetadataQueryParamDto,
  ): Promise<MetadataDashboardSurveryNestedResponseDto | MetadataSurveyListNestedResponseDto> {
    return await this.surveyRepository.getSurveyMetadata(userId, searchQuery);
  }

  async getRecentSurvey(userId: number): Promise<DashboardRecentSurveyNestedResponseDto[]> {
    return await this.surveyRepository.getRecentSurvey(userId);
  }

  async getSurveyDetail(surveyId: number, userId?: number): Promise<SurveyDetailNestedResponseDto> {
    return await this.surveyRepository.getSurveyDetail(surveyId, userId);
  }

  async getSurveyDetailAndViewCountUpdate(hashedUniqueKey: string, userId?: number): Promise<SurveyDetailNestedResponseDto> {
    const survey = await this.surveyRepository.getSurveyDetailByHashedUniqueKey(hashedUniqueKey, userId);
    await this.surveyRepository.viewCountUpdate(hashedUniqueKey);
    return survey;
  }

  async toggleSurveyVisibility(userId: number, surveyId: number, updateSurveyVisibilityPayloadDto: UpdateSurveyVisibilityPayloadDto): Promise<void> {
    const subscription = await this.surveyRepository.getCurrentOrganization(userId);

    const survey = await this.surveyRepository.getSurveyDetail(surveyId, userId);

    if (!survey) {
      throw new NotFoundSurveyExceptionDto();
    }

    // TODO: 권한 체크 로직 변경 (동일 조직인지 확인)
    // TODO: Editor 이상 권한인지 확인
    if (survey.subscriptionId !== subscription.id) {
      throw new ForbiddenAccessExceptionDto();
    }

    if (!isRoleAtLeast(subscription.permission.role, UserRole.Editor)) {
      throw new ForbiddenAccessExceptionDto();
    }

    await this.surveyRepository.toggleSurveyVisibility(surveyId, updateSurveyVisibilityPayloadDto);
  }

  async updateSurveyStatus(surveyId: number, userId: number, updateSurveyStatusPayloadDto: UpdateSurveyStatusPayloadDto): Promise<void> {
    const survey = await this.surveyRepository.getSurveyDetail(surveyId, userId);

    if (!survey) {
      throw new NotFoundSurveyExceptionDto();
    }

    await this.surveyRepository.updateSurveyStatus(surveyId, updateSurveyStatusPayloadDto);
  }

  async updateSurvey(surveyId: number, userId: number, updateSurveyPayloadDto: UpdateSurveyPayloadDto): Promise<void> {
    const survey = await this.surveyRepository.existsByWithDeleted({ id: surveyId });

    if (!survey) {
      throw new NotFoundSurveyExceptionDto();
    }

    await this.surveyRepository.updateSurvey(surveyId, userId, updateSurveyPayloadDto);
  }

  async deleteSurvey(userId: number, surveyId: number): Promise<void> {
    const survey = await this.surveyRepository.getSurveyDetail(surveyId, userId);

    if (!survey) {
      throw new NotFoundSurveyExceptionDto();
    }

    const subscription = await this.surveyRepository.getCurrentOrganization(userId);

    if (survey.subscriptionId !== subscription.id) {
      throw new ForbiddenAccessExceptionDto();
    }

    await this.surveyRepository.deleteSurvey(surveyId, userId);
  }
}
