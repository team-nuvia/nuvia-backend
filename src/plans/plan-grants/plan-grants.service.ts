import { Injectable } from '@nestjs/common';
import { CreatePlanGrantDto } from './dto/create-plan-grant.dto';
import { UpdatePlanGrantDto } from './dto/update-plan-grant.dto';

@Injectable()
export class PlanGrantsService {
  create(createPlanGrantDto: CreatePlanGrantDto) {
    return 'This action adds a new planGrant';
  }

  findAll() {
    return `This action returns all planGrants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} planGrant`;
  }

  update(id: number, updatePlanGrantDto: UpdatePlanGrantDto) {
    return `This action updates a #${id} planGrant`;
  }

  remove(id: number) {
    return `This action removes a #${id} planGrant`;
  }
}
