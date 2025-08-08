import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { BadRequestException, UnauthorizedException } from '@common/dto/response';
import { Body, Controller, Get, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SurveySearchQueryParamDto } from './dto/param/survey-search-query.param.dto';
import { CreateSurveyPayloadDto } from './dto/payload/create-survey.payload.dto';
import { UpdateSurveyPayloadDto } from './dto/payload/update-survey.payload.dto';
import { CreateSurveyResponseDto } from './dto/response/create-survey.response.dto';
import { GetSurveyResponseDto } from './dto/response/get-survey.response.dto';
import { UpdateSurveyResponseDto } from './dto/response/update-survey.response.dto';
import { SurveysService } from './surveys.service';

@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @ApiOperation({ summary: '설문 생성' })
  @CombineResponses(HttpStatus.CREATED, CreateSurveyResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
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

  @ApiOperation({ summary: '설문 수정' })
  @CombineResponses(HttpStatus.OK, UpdateSurveyResponseDto)
  @CombineResponses(HttpStatus.BAD_REQUEST, BadRequestException)
  @CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException)
  @RequiredLogin
  @Put(':id')
  async updateSurvey(@Param('id') id: string, @Body() updateSurveyPayloadDto: UpdateSurveyPayloadDto): Promise<UpdateSurveyResponseDto> {
    await this.surveysService.updateSurvey(+id, updateSurveyPayloadDto);
    return new UpdateSurveyResponseDto();
  }
}
