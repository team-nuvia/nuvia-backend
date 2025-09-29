import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlanGrantsService } from './plan-grants.service';

@RequiredLogin
@ApiTags('플랜 제약사항')
@Controller(':planId/plan-grants')
export class PlanGrantsController {
  constructor(private readonly planGrantsService: PlanGrantsService) {}

  @ApiOperation({ summary: '플랜 제약사항 조회' })
  @Get()
  findAll(@Param('planId') planId: string) {
    return this.planGrantsService.findAll(planId);
  }
}
