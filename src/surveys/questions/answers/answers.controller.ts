import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { ExtractJwsToken } from '@common/decorator/extract-jws.decorator';
import { ExtractSubmissionHash } from '@common/decorator/extract-submission-hash.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { Public } from '@common/decorator/public.decorator';
import { Body, Controller, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AnswersService } from './answers.service';
import { CreateAnswerPayloadDto } from './dto/payload/create-answer.payload.dto';
import { StartAnswerPayloadDto } from './dto/payload/start-answer.payload.dto';
import { CreateAnswerResponseDto } from './dto/response/create-answer.response.dto';
import { StartAnswerResponseDto } from './dto/response/start-answer.response.dto';
import { SuccessValidateFirstSurveyAnswerResponseDto } from './dto/response/success-validate-first-survey-answer.response.dto';

@ApiTags('설문 답변')
@Controller(':surveyId/answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @ApiOperation({
    summary: '설문 답변 시작',
    description: '설문 답변을 시작합니다.',
  })
  @CombineResponses(HttpStatus.CREATED, StartAnswerResponseDto)
  @CombineResponses(HttpStatus.UNAUTHORIZED)
  @Public()
  @Post('start')
  async startAnswer(
    @LoginUser() user: LoginUserData,
    @Param('surveyId') surveyId: number,
    @Res({ passthrough: true }) res: Response,
    @Body() startAnswerPayloadDto: StartAnswerPayloadDto,
  ) {
    const THREE_DAYS = 1000 * 60 * 60 * 24 * 3;
    const { jwsToken, submissionHash } = await this.answersService.startAnswer(surveyId, startAnswerPayloadDto, user?.id);

    // session 등록을 위한 쿠키 설정 (만료기간 없음)
    res.cookie('X-Client-Hash', submissionHash, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    // expired at 3days
    res.cookie('X-Client-Jws', jwsToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: THREE_DAYS,
    });

    return new StartAnswerResponseDto();
  }

  @ApiOperation({
    summary: '설문 답변 첫 번째 질문 유효성 검사',
    description: '설문 답변 첫 번째 질문 유효성 검사를 합니다.',
  })
  @Public()
  @Post('validate')
  async validateFirstSurveyAnswer(
    @ExtractSubmissionHash() submissionHash: string,
    @ExtractJwsToken() jws: string,
    @Param('surveyId') surveyId: number,
  ) {
    await this.answersService.validateFirstSurveyAnswer(submissionHash, jws, surveyId);
    return new SuccessValidateFirstSurveyAnswerResponseDto();
  }

  @ApiOperation({
    summary: '설문 답변 생성',
    description: '설문 답변을 생성합니다.',
  })
  @CombineResponses(HttpStatus.CREATED, CreateAnswerResponseDto)
  @Public()
  @Post()
  async create(
    @LoginUser() user: LoginUserData,
    @Param('surveyId') surveyId: number,
    @ExtractSubmissionHash() submissionHash: string,
    @Body() createAnswerPayloadDto: CreateAnswerPayloadDto,
  ) {
    await this.answersService.create(createAnswerPayloadDto, surveyId, submissionHash, user?.id);
    return new CreateAnswerResponseDto();
  }
}
