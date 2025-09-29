import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlansService } from './plans.service';

@RequiredLogin
@ApiTags('플랜')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @ApiOperation({ summary: '플랜 조회' })
  @Get()
  findAll() {
    return this.plansService.findAll();
  }

  @ApiOperation({ summary: '플랜 상세 조회' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(+id);
  }
}
