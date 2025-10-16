import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { LoginUser } from '@common/decorator/login-user.param.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { AnalysesService } from './analyses.service';
import { GetBasicAnalysesResponseDto } from './dto/response/get-basic-analyses.response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { Public } from '@common/decorator/public.decorator';

@RequiredLogin
@Controller('analyses')
export class AnalysesController {
  constructor(private readonly analysesService: AnalysesService) {}

  @ApiOperation({ summary: '기본 분석 데이터 조회' })
  @CombineResponses(HttpStatus.OK, GetBasicAnalysesResponseDto)
  @Public()
  @Get('basic/:surveyId')
  async findBasicAnalyses(@Param('surveyId') surveyId: number, @LoginUser() user: LoginUserData) {
    const result = await this.analysesService.findBasicAnalyses(surveyId, user.id);
    return new GetBasicAnalysesResponseDto(result);
  }
}
