import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Transactional } from '@common/decorator/transactional.decorator';
import { BadRequestException, UnauthorizedException } from '@common/dto/response';
import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SurveySearchQueryParamDto } from './dto/param/survey-search-query.param.dto';
import { CreateSurveyPayloadDto } from './dto/payload/create-survey.payload.dto';
import { UpdateSurveyVisibilityPayloadDto } from './dto/payload/update-survey-visibility.payload.dto';
import { UpdateSurveyPayloadDto } from './dto/payload/update-survey.payload.dto';
import { CreateSurveyResponseDto } from './dto/response/create-survey.response.dto';
import { DeleteSurveyResponseDto } from './dto/response/delete-survey.response.dto';
import { GetRecentSurveyResponseDto } from './dto/response/get-recent-survey.response.dto';
import { GetSurveyCategoryResponseDto } from './dto/response/get-survey-category.response.dto';
import { GetSurveyDetailResponseDto } from './dto/response/get-survey-detail.response.dto';
import { GetSurveyListResponseDto } from './dto/response/get-survey-list.response.dto';
import { GetSurveyMetadataResponseDto } from './dto/response/get-survey-metadata.response.dto';
import { GetSurveyResponseDto } from './dto/response/get-survey.response.dto';
import { UpdateSurveyVisibilityResponseDto } from './dto/response/update-survey-visibility.response.dto';
import { UpdateSurveyResponseDto } from './dto/response/update-survey.response.dto';
import { SurveyCreateConstraintValidation } from './survey-create-constraint.guard';
import { SurveyUpdateConstraintValidation } from './survey-update-constraint.guard';
import { SurveysService } from './surveys.service';

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
    await this.surveysService.createSurvey(user.id, createSurveyPayloadDto);
    return new CreateSurveyResponseDto();
  }

  @ApiOperation({ summary: '설문 목록 조회' })
  @CombineResponses(HttpStatus.OK, GetSurveyResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @RequiredLogin
  @Get('me')
  async getSurvey(@LoginUser() user: LoginUserData, @Query() searchQuery: SurveySearchQueryParamDto): Promise<GetSurveyResponseDto> {
    const survey = await this.surveysService.getSurvey(user.id, searchQuery);
    return new GetSurveyResponseDto(survey);
  }

  @ApiOperation({ summary: '설문 메타데이터 조회' })
  @CombineResponses(HttpStatus.OK, GetSurveyMetadataResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @RequiredLogin
  @Get('metadata')
  async getSurveyMetadata(@LoginUser() user: LoginUserData): Promise<GetSurveyMetadataResponseDto> {
    const metadata = await this.surveysService.getSurveyMetadata(user.id);
    return new GetSurveyMetadataResponseDto(metadata);
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
  async getSurveyList(@LoginUser() user: LoginUserData, @Query() searchQuery: SurveySearchQueryParamDto): Promise<GetSurveyListResponseDto> {
    const survey = await this.surveysService.getSurveyList(user.id, searchQuery);
    return new GetSurveyListResponseDto(survey);
  }

  @ApiOperation({ summary: '최근 생성된 설문 조회' })
  @CombineResponses(HttpStatus.OK, GetRecentSurveyResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @RequiredLogin
  @Get('recent')
  async getRecentSurvey(@LoginUser() user: LoginUserData): Promise<GetRecentSurveyResponseDto> {
    const survey = await this.surveysService.getRecentSurvey(user.id);
    return new GetRecentSurveyResponseDto(survey);
  }

  @ApiOperation({ summary: '설문 상세 조회 (유니크 키로 조회)' })
  @CombineResponses(HttpStatus.OK, GetSurveyDetailResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @Transactional()
  @Get('view/:hashedUniqueKey')
  async getSurveyDetailAndViewCountUpdate(@Param('hashedUniqueKey') hashedUniqueKey: string): Promise<GetSurveyDetailResponseDto> {
    const survey = await this.surveysService.getSurveyDetailAndViewCountUpdate(hashedUniqueKey);
    return new GetSurveyDetailResponseDto(survey);
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

  @ApiOperation({ summary: '설문 수정' })
  @CombineResponses(HttpStatus.OK, UpdateSurveyResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @SurveyUpdateConstraintValidation()
  @Transactional()
  @RequiredLogin
  @Put(':id')
  async updateSurvey(
    @LoginUser() user: LoginUserData,
    @Param('id') id: string,
    @Body() updateSurveyPayloadDto: UpdateSurveyPayloadDto,
  ): Promise<UpdateSurveyResponseDto> {
    await this.surveysService.updateSurvey(+id, user.id, updateSurveyPayloadDto);
    return new UpdateSurveyResponseDto();
  }

  @ApiOperation({ summary: '설문 삭제' })
  @CombineResponses(HttpStatus.OK, DeleteSurveyResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @RequiredLogin
  @Delete(':id')
  async deleteSurvey(@LoginUser() user: LoginUserData, @Param('id') id: string): Promise<DeleteSurveyResponseDto> {
    await this.surveysService.deleteSurvey(user.id, +id);
    return new DeleteSurveyResponseDto();
  }
}
