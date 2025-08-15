import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { Public } from '@common/decorator/public.decorator';
import { Body, Controller, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnswersService } from './answers.service';
import { CreateAnswerPayloadDto } from './dto/payload/create-answer.payload.dto';
import { CreateAnswerResponseDto } from './dto/response/create-answer.response.dto';

@ApiTags('설문 답변')
@Controller(':surveyId/answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @ApiOperation({
    summary: '설문 답변 생성',
    description: '설문 답변을 생성합니다.',
  })
  @CombineResponses(HttpStatus.CREATED, CreateAnswerResponseDto)
  @Public()
  @Post()
  async create(@LoginUser() user: LoginUserData, @Param('surveyId') surveyId: number, @Body() createAnswerPayloadDto: CreateAnswerPayloadDto) {
    await this.answersService.create(createAnswerPayloadDto, surveyId, user?.id);
    return new CreateAnswerResponseDto();
  }
}
