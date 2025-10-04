import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { ExtractJwsToken } from '@common/decorator/extract-jws.decorator';
import { ExtractSubmissionHash } from '@common/decorator/extract-submission-hash.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { Public } from '@common/decorator/public.decorator';
import { BadRequestException } from '@common/dto/response';
import { VERIFY_JWS_EXPIRE_TIME } from '@common/variable/globals';
import { Body, Controller, HttpStatus, Param, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AnswersService } from './answers.service';
import { NotFoundAnswerExceptionDto } from './dto/exception/not-found-answer.exception.dto';
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
  @CombineResponses(HttpStatus.OK, StartAnswerResponseDto)
  @CombineResponses(HttpStatus.UNAUTHORIZED)
  @Public()
  @Post('start')
  async startAnswer(
    @LoginUser() user: LoginUserData,
    @ExtractSubmissionHash() submissionHashCookie: string,
    @ExtractJwsToken() jwsCookie: string,
    @Param('surveyId') surveyId: number,
    @Res({ passthrough: true }) res: Response,
    @Body() startAnswerPayloadDto: StartAnswerPayloadDto,
  ) {
    if (jwsCookie || submissionHashCookie) {
      throw new BadRequestException();
    }

    /* 6시간 */
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
      maxAge: VERIFY_JWS_EXPIRE_TIME,
    });

    return new StartAnswerResponseDto();
  }

  @ApiOperation({
    summary: '설문 답변 갱신',
    description: '설문 답변을 갱신합니다.',
  })
  @CombineResponses(HttpStatus.OK, StartAnswerResponseDto)
  @Public()
  @Post('refresh')
  async refreshAnswer(
    @Param('surveyId') surveyId: number,
    @ExtractSubmissionHash() submissionHash: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.answersService.refreshAnswer(surveyId, submissionHash, res);
    return new StartAnswerResponseDto();
  }

  @ApiOperation({
    summary: '설문 답변 첫 번째 질문 유효성 검사',
    description: '설문 답변 첫 번째 질문 유효성 검사를 합니다.',
  })
  @CombineResponses(HttpStatus.OK, SuccessValidateFirstSurveyAnswerResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundAnswerExceptionDto)
  @Public()
  @Post('validate')
  async validateFirstSurveyAnswer(
    @ExtractSubmissionHash() submissionHash: string,
    @ExtractJwsToken() jws: string,
    @Param('surveyId') surveyId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.answersService.validateFirstSurveyAnswer(submissionHash, jws, surveyId, res);
    return new SuccessValidateFirstSurveyAnswerResponseDto(result);
  }

  @ApiOperation({
    summary: '설문 답변 생성',
    description: '설문 답변을 생성합니다.',
  })
  @CombineResponses(HttpStatus.CREATED, CreateAnswerResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundAnswerExceptionDto)
  @Public()
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @LoginUser() user: LoginUserData,
    @Param('surveyId') surveyId: number,
    @Res({ passthrough: true }) res: Response,
    @ExtractSubmissionHash() submissionHash: string,
    @Body() createAnswerPayloadDto: CreateAnswerPayloadDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('🚀 ~ AnswersController ~ create ~ createAnswerPayloadDto:', createAnswerPayloadDto);
    const transferedFiles = files.map((file) => ({
      ...file,
      filename: Buffer.from(file.originalname, 'latin1').toString('utf8'),
    }));

    await this.answersService.createAnswer(createAnswerPayloadDto, surveyId, submissionHash, res, user?.id, transferedFiles);
    return new CreateAnswerResponseDto();
  }
}
