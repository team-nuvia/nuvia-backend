import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlanGrantsService } from './plan-grants.service';
import { CreatePlanGrantDto } from './dto/create-plan-grant.dto';
import { UpdatePlanGrantDto } from './dto/update-plan-grant.dto';

@Controller('plan-grants')
export class PlanGrantsController {
  constructor(private readonly planGrantsService: PlanGrantsService) {}

  @Post()
  create(@Body() createPlanGrantDto: CreatePlanGrantDto) {
    return this.planGrantsService.create(createPlanGrantDto);
  }

  @Get()
  findAll() {
    return this.planGrantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planGrantsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanGrantDto: UpdatePlanGrantDto) {
    return this.planGrantsService.update(+id, updatePlanGrantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planGrantsService.remove(+id);
  }
}
