import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { BadRequestException, UnauthorizedException } from '@common/dto/response';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateSurveyPayloadDto } from './dto/payload/create-survey.payload.dto';
import { CreateSurveyResponseDto } from './dto/response/create-survey.response.dto';
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
  async createSurvey(@Body() createSurveyPayloadDto: CreateSurveyPayloadDto): Promise<CreateSurveyResponseDto> {
    console.log('🚀 ~ SurveysController ~ createSurvey ~ createSurveyPayloadDto:', createSurveyPayloadDto);
    await this.surveysService.createSurvey(createSurveyPayloadDto);
    return new CreateSurveyResponseDto();
  }
}
