import { NotFoundOrganizationRoleExceptionDto } from '@/subscriptions/organization-roles/dto/exception/not-found-organization-role.exception.dto';
import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { ExtractSubmissionHash } from '@common/decorator/extract-submission-hash.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { Public } from '@common/decorator/public.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Transactional } from '@common/decorator/transactional.decorator';
import { BadRequestException, UnauthorizedException } from '@common/dto/response';
import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MetadataStatusType } from '@share/enums/metadata-status-type';
import { Request } from 'express';
import { ClosedSurveyExceptionDto } from './dto/exception/closed-survey.exception.dto';
import { SurveyGraphSearchQueryParamDto } from './dto/param/survey-graph-search-query.param.dto';
import { SurveyMetadataQueryParamDto } from './dto/param/survey-metadata-query.param.dto';
import { SurveySearchQueryParamDto } from './dto/param/survey-search-query.param.dto';
import { CreateSurveyPayloadDto } from './dto/payload/create-survey.payload.dto';
import { UpdateSurveyStatusPayloadDto } from './dto/payload/update-survey-status.payload.dto';
import { UpdateSurveyVisibilityPayloadDto } from './dto/payload/update-survey-visibility.payload.dto';
import { UpdateSurveyPayloadDto } from './dto/payload/update-survey.payload.dto';
import { CreateSurveyResponseDto } from './dto/response/create-survey.response.dto';
import { DeleteSurveyResponseDto } from './dto/response/delete-survey.response.dto';
import { GetRecentSurveyResponseDto } from './dto/response/get-recent-survey.response.dto';
import { GetSurveyBinResponseDto } from './dto/response/get-survey-bin.response.dto';
import { GetSurveyCategoryResponseDto } from './dto/response/get-survey-category.response.dto';
import { GetSurveyDetailViewResponseDto } from './dto/response/get-survey-detail-view.response.dto';
import { GetSurveyDetailResponseDto } from './dto/response/get-survey-detail.response.dto';
import { GetSurveyGraphResponseDto } from './dto/response/get-survey-graph.response.dto';
import { GetSurveyListResponseDto } from './dto/response/get-survey-list.response.dto';
import { GetSurveyMetadataResponseDto, GetSurveyMetadataSurveyListResponseDto } from './dto/response/get-survey-metadata.response.dto';
import { MetadataDashboardSurveyNestedResponseDto } from './dto/response/metadata-dashboard-survey.nested.dto';
import { MetadataSurveyListNestedResponseDto } from './dto/response/metadata-survey-list.nested.response.dto';
import { RestoreAllSurveyResponseDto } from './dto/response/restore-all-survey.response.dto';
import { RestoreSurveyResponseDto } from './dto/response/restore-survey.response.dto';
import { UpdateSurveyStatusResponseDto } from './dto/response/update-survey-status.response.dto';
import { UpdateSurveyVisibilityResponseDto } from './dto/response/update-survey-visibility.response.dto';
import { UpdateSurveyResponseDto } from './dto/response/update-survey.response.dto';
import { SurveyCreateConstraintValidation } from './survey-create-constraint.guard';
import { SurveyDeleteConstraintValidation } from './survey-delete-constraint.guard';
import { SurveyRestoreConstraintValidation } from './survey-restore-constraint.guard';
import { SurveyUpdateConstraintValidation } from './survey-update-constraint.guard';
import { SurveysService } from './surveys.service';
import { NotFoundSurveyExceptionDto } from './dto/exception/not-found-survey.exception.dto';

@ApiTags('설문')
@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @ApiOperation({ summary: '설문 생성' })
  @CombineResponses(HttpStatus.CREATED, CreateSurveyResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @SurveyCreateConstraintValidation()
  @Transactional()
  @RequiredLogin
  @Post()
  async createSurvey(@LoginUser() user: LoginUserData, @Body() createSurveyPayloadDto: CreateSurveyPayloadDto): Promise<CreateSurveyResponseDto> {
    const surveyId = await this.surveysService.createSurvey(user.id, createSurveyPayloadDto);
    return new CreateSurveyResponseDto({ id: surveyId });
  }

  @ApiOperation({ summary: '설문 복구' })
  @CombineResponses(HttpStatus.OK, RestoreSurveyResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @SurveyRestoreConstraintValidation()
  @Transactional()
  @RequiredLogin
  @Patch(':surveyId/restore')
  async restoreSurvey(@LoginUser() user: LoginUserData, @Param('surveyId') surveyId: string): Promise<RestoreSurveyResponseDto> {
    await this.surveysService.restoreSurvey(+surveyId, user.id);
    return new RestoreSurveyResponseDto();
  }

  @ApiOperation({ summary: '설문 전체 복구' })
  @CombineResponses(HttpStatus.OK, RestoreAllSurveyResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @Transactional()
  @RequiredLogin
  @Patch('restore-all')
  async restoreAllSurvey(@LoginUser() user: LoginUserData): Promise<RestoreAllSurveyResponseDto> {
    await this.surveysService.restoreAllSurvey(user.id);
    return new RestoreAllSurveyResponseDto();
  }

  @ApiOperation({ summary: '삭제된 설문 조회' })
  @CombineResponses(HttpStatus.OK, GetSurveyBinResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @RequiredLogin
  @Get('bin')
  async getDeletedSurvey(@LoginUser() user: LoginUserData, @Query() searchQuery: SurveySearchQueryParamDto): Promise<GetSurveyBinResponseDto> {
    const survey = await this.surveysService.getDeletedSurvey(user.id, searchQuery);
    return new GetSurveyBinResponseDto(survey);
  }

  @ApiOperation({ summary: '설문 메타데이터 조회' })
  @CombineResponses(HttpStatus.OK, GetSurveyMetadataResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @RequiredLogin
  @Get('graph/respondent')
  async getSurveyRespondentGraphData(
    @LoginUser() user: LoginUserData,
    @Query() searchQuery: SurveyGraphSearchQueryParamDto,
  ): Promise<GetSurveyGraphResponseDto> {
    const graphData = await this.surveysService.getSurveyRespondentGraphData(user.id, searchQuery);
    return new GetSurveyGraphResponseDto(graphData);
  }

  @ApiOperation({ summary: '설문 메타데이터 조회' })
  @CombineResponses(HttpStatus.OK, GetSurveyMetadataResponseDto, GetSurveyMetadataSurveyListResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @RequiredLogin
  @Get('metadata')
  async getSurveyMetadata(
    @LoginUser() user: LoginUserData,
    @Query() searchQuery: SurveyMetadataQueryParamDto,
  ): Promise<GetSurveyMetadataResponseDto | GetSurveyMetadataSurveyListResponseDto> {
    const metadata = await this.surveysService.getSurveyMetadata(user.id, searchQuery);
    if (searchQuery.status === MetadataStatusType.Dashboard) {
      return new GetSurveyMetadataResponseDto(metadata as MetadataDashboardSurveyNestedResponseDto);
    } else {
      return new GetSurveyMetadataSurveyListResponseDto(metadata as MetadataSurveyListNestedResponseDto);
    }
  }

  @ApiOperation({ summary: '카테고리 조회' })
  @CombineResponses(HttpStatus.OK, GetSurveyCategoryResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @RequiredLogin
  @Get('categories')
  async getSurveyCategories(): Promise<GetSurveyCategoryResponseDto> {
    const categories = await this.surveysService.getSurveyCategories();
    return new GetSurveyCategoryResponseDto(categories);
  }

  @ApiOperation({ summary: '설문 조회' })
  @CombineResponses(HttpStatus.OK, GetSurveyListResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @RequiredLogin
  @Get()
  async getSurveyList(
    @LoginUser() user: LoginUserData,
    @Query() searchQuery: SurveySearchQueryParamDto,
    @Req() req: Request,
  ): Promise<GetSurveyListResponseDto> {
    const survey = await this.surveysService.getSurveyList(user.id, searchQuery);
    return new GetSurveyListResponseDto(survey);
  }

  @ApiOperation({ summary: '최근 생성된 설문 조회' })
  @CombineResponses(HttpStatus.OK, GetRecentSurveyResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundOrganizationRoleExceptionDto)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @RequiredLogin
  @Get('recent')
  async getRecentSurvey(@LoginUser() user: LoginUserData): Promise<GetRecentSurveyResponseDto> {
    const survey = await this.surveysService.getRecentSurvey(user.id);
    return new GetRecentSurveyResponseDto(survey);
  }

  @ApiOperation({ summary: '설문 상세 조회 (유니크 키로 조회)' })
  @CombineResponses(HttpStatus.OK, GetSurveyDetailViewResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException, ClosedSurveyExceptionDto)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundSurveyExceptionDto)
  @Transactional()
  @Public()
  @Get('view/:hashedUniqueKey')
  async getSurveyDetailAndViewCountUpdate(
    @LoginUser() user: LoginUserData,
    @Param('hashedUniqueKey') hashedUniqueKey: string,
    @ExtractSubmissionHash() submissionHash?: string,
  ): Promise<GetSurveyDetailViewResponseDto> {
    const survey = await this.surveysService.getSurveyDetailAndViewCountUpdate(hashedUniqueKey, submissionHash, user?.id);
    return new GetSurveyDetailViewResponseDto(survey);
  }

  @ApiOperation({ summary: '설문 상세 조회' })
  @CombineResponses(HttpStatus.OK, GetSurveyDetailResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @Transactional()
  @RequiredLogin
  @Get(':surveyId')
  async getSurveyDetail(@LoginUser() user: LoginUserData, @Param('surveyId') surveyId: string): Promise<GetSurveyDetailResponseDto> {
    const survey = await this.surveysService.getSurveyDetail(+surveyId, user.id);
    return new GetSurveyDetailResponseDto(survey);
  }

  @ApiOperation({ summary: '설문 공개 여부 변경' })
  @CombineResponses(HttpStatus.OK, UpdateSurveyVisibilityResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @RequiredLogin
  @Patch(':surveyId/visibility')
  async toggleSurveyVisibility(
    @LoginUser() user: LoginUserData,
    @Param('surveyId') surveyId: string,
    @Body() updateSurveyVisibilityPayloadDto: UpdateSurveyVisibilityPayloadDto,
  ): Promise<UpdateSurveyVisibilityResponseDto> {
    await this.surveysService.toggleSurveyVisibility(user.id, +surveyId, updateSurveyVisibilityPayloadDto);
    return new UpdateSurveyVisibilityResponseDto();
  }

  @ApiOperation({ summary: '설문 상태 변경' })
  @CombineResponses(HttpStatus.OK, UpdateSurveyStatusResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @RequiredLogin
  @Patch(':surveyId/status')
  async updateSurveyStatus(
    @LoginUser() user: LoginUserData,
    @Param('surveyId') surveyId: string,
    @Body() updateSurveyStatusPayloadDto: UpdateSurveyStatusPayloadDto,
  ): Promise<UpdateSurveyStatusResponseDto> {
    await this.surveysService.updateSurveyStatus(+surveyId, user.id, updateSurveyStatusPayloadDto);
    return new UpdateSurveyStatusResponseDto();
  }

  @ApiOperation({ summary: '설문 수정' })
  @CombineResponses(HttpStatus.OK, UpdateSurveyResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @SurveyUpdateConstraintValidation()
  @Transactional()
  @RequiredLogin
  @Put(':surveyId')
  async updateSurvey(
    @LoginUser() user: LoginUserData,
    @Param('surveyId') surveyId: string,
    @Body() updateSurveyPayloadDto: UpdateSurveyPayloadDto,
  ): Promise<UpdateSurveyResponseDto> {
    await this.surveysService.updateSurvey(+surveyId, user.id, updateSurveyPayloadDto);
    return new UpdateSurveyResponseDto();
  }

  @ApiOperation({ summary: '설문 삭제' })
  @CombineResponses(HttpStatus.OK, DeleteSurveyResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @SurveyDeleteConstraintValidation()
  @RequiredLogin
  @Delete(':surveyId')
  async deleteSurvey(@LoginUser() user: LoginUserData, @Param('surveyId') surveyId: string): Promise<DeleteSurveyResponseDto> {
    await this.surveysService.deleteSurvey(user.id, +surveyId);
    return new DeleteSurveyResponseDto();
  }
}
