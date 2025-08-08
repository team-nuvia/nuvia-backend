import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlanGrantsService } from './plan-grants.service';

@RequiredLogin
@ApiTags('플랜 제약사항')
@Controller('plan-grants')
export class PlanGrantsController {
  constructor(private readonly planGrantsService: PlanGrantsService) {}

  @Get()
  findAll() {
    return this.planGrantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planGrantsService.findOne(+id);
  }
}
