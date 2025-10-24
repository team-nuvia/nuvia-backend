import { ClosedSurveyExceptionDto } from '@/surveys/dto/exception/closed-survey.exception.dto';
import { NotFoundSurveyExceptionDto } from '@/surveys/dto/exception/not-found-survey.exception.dto';
import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { ExtractJwsToken } from '@common/decorator/extract-jws.decorator';
import { ExtractSubmissionHash } from '@common/decorator/extract-submission-hash.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { Public } from '@common/decorator/public.decorator';
import { JWS_COOKIE_NAME, SUBMISSION_HASH_COOKIE_NAME, VERIFY_JWS_EXPIRE_TIME } from '@common/variable/globals';
import { Body, Controller, HttpStatus, Param, Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AnswersService } from './answers.service';
import { AlreadyAnswerStartedExceptionDto } from './dto/exception/already-answer-started.exception.dto';
import { ExpiredJwsExceptionDto } from './dto/exception/expired-jws.exception.dto';
import { LoginRequiredForAnswerExceptionDto } from './dto/exception/login-required-for-answer.exception.dto';
import { NoVerifyAccessTokenExceptionDto } from './dto/exception/no-verify-access-token.jws.dto';
import { NotFoundAnswerExceptionDto } from './dto/exception/not-found-answer.exception.dto';
import { RequiredRefreshJwsExceptionDto } from './dto/exception/required-refresh-jws.exception.dto';
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
  @CombineResponses(HttpStatus.BAD_REQUEST, AlreadyAnswerStartedExceptionDto, ClosedSurveyExceptionDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundSurveyExceptionDto)
  @Public()
  @Post('start')
  async startAnswer(
    @Req() req: Request,
    @LoginUser() user: LoginUserData,
    @ExtractSubmissionHash() submissionHashCookie: string,
    @ExtractJwsToken() jwsCookie: string,
    @Param('surveyId') surveyId: number,
    @Res({ passthrough: true }) res: Response,
    @Body() startAnswerPayloadDto: StartAnswerPayloadDto,
  ) {
    const realIp = req.realIp;
    let submissionHash: string = submissionHashCookie;
    let jwsToken: string = jwsCookie;

    if (jwsCookie || submissionHashCookie) {
      /* 비회원인 경우 이미 작성중인 응답이 있으면 예외 발생 */
      if (user?.id === null) {
        throw new AlreadyAnswerStartedExceptionDto();
      }

      /* 회원인 경우 이미 작성중인 응답이 있으면 계속 작성 */
      await this.answersService.continueAnswer(surveyId, startAnswerPayloadDto, realIp, submissionHash, jwsToken, res, user?.id);
    } else {
      /* 6시간 */
      const result = await this.answersService.startAnswer(surveyId, startAnswerPayloadDto, realIp, user?.id);
      submissionHash = result.submissionHash;
      jwsToken = result.jwsToken;
    }

    // session 등록을 위한 쿠키 설정 (만료기간 없음)
    res.cookie(SUBMISSION_HASH_COOKIE_NAME, submissionHash, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });

    // expired at 3days
    res.cookie(JWS_COOKIE_NAME, jwsToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
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
  @CombineResponses(HttpStatus.BAD_REQUEST, ClosedSurveyExceptionDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundSurveyExceptionDto, NotFoundAnswerExceptionDto)
  @Public()
  @Post('refresh')
  async refreshAnswer(
    @Req() req: Request,
    @LoginUser() user: LoginUserData,
    @Param('surveyId') surveyId: number,
    @ExtractSubmissionHash() submissionHash: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.answersService.refreshAnswer(surveyId, submissionHash, req.realIp, res, user?.id);
    return new StartAnswerResponseDto();
  }

  @ApiOperation({
    summary: '설문 답변 첫 번째 질문 유효성 검사',
    description: '설문 답변 첫 번째 질문 유효성 검사를 합니다.',
  })
  @CombineResponses(HttpStatus.OK, SuccessValidateFirstSurveyAnswerResponseDto)
  @CombineResponses(HttpStatus.NOT_FOUND, NotFoundSurveyExceptionDto, NotFoundAnswerExceptionDto)
  @CombineResponses(
    HttpStatus.BAD_REQUEST,
    ExpiredJwsExceptionDto,
    NoVerifyAccessTokenExceptionDto,
    RequiredRefreshJwsExceptionDto,
    LoginRequiredForAnswerExceptionDto,
  )
  @Public()
  @Post('validate')
  async validateFirstSurveyAnswer(
    @Req() req: Request,
    @LoginUser() user: LoginUserData,
    @ExtractSubmissionHash() submissionHash: string,
    @ExtractJwsToken() jws: string,
    @Param('surveyId') surveyId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.answersService.validateFirstSurveyAnswer(submissionHash, jws, surveyId, req.realIp, res, user?.id);
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
    @Req() req: Request,
    @LoginUser() user: LoginUserData,
    @Param('surveyId') surveyId: number,
    @Res({ passthrough: true }) res: Response,
    @ExtractSubmissionHash() submissionHash: string,
    @Body() createAnswerPayloadDto: CreateAnswerPayloadDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const transferedFiles = files.map((file) => ({
      ...file,
      filename: Buffer.from(file.originalname, 'latin1').toString('utf8'),
    }));

    await this.answersService.createAnswer(createAnswerPayloadDto, surveyId, submissionHash, res, req.realIp, user?.id, transferedFiles);
    return new CreateAnswerResponseDto();
  }
}
