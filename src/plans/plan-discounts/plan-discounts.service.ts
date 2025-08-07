import { Injectable } from '@nestjs/common';
import { CreatePlanDiscountDto } from './dto/create-plan-discount.dto';
import { UpdatePlanDiscountDto } from './dto/update-plan-discount.dto';

@Injectable()
export class PlanDiscountsService {
  create(createPlanDiscountDto: CreatePlanDiscountDto) {
    return 'This action adds a new planDiscount';
  }

  findAll() {
    return `This action returns all planDiscounts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} planDiscount`;
  }

  update(id: number, updatePlanDiscountDto: UpdatePlanDiscountDto) {
    return `This action updates a #${id} planDiscount`;
  }

  remove(id: number) {
    return `This action removes a #${id} planDiscount`;
  }
}
