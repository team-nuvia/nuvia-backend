import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlansService } from './plans.service';
import { GetPlansResponseDto } from './dto/response/get-plans.response.dto';
import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { Public } from '@common/decorator/public.decorator';

@ApiTags('플랜')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @ApiOperation({ summary: '플랜 조회' })
  @CombineResponses(HttpStatus.OK, GetPlansResponseDto)
  @Public()
  @Get()
  async findAll(): Promise<GetPlansResponseDto> {
    const plans = await this.plansService.findAll();
    return new GetPlansResponseDto(plans);
  }

  @ApiOperation({ summary: '플랜 상세 조회' })
  @Get(':id')
  @RequiredLogin
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(+id);
  }
}
