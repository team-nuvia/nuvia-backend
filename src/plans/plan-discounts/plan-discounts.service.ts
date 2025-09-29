import { Injectable } from '@nestjs/common';
import { CreatePlanDiscountDto } from './dto/create-plan-discount.dto';
import { UpdatePlanDiscountDto } from './dto/update-plan-discount.dto';
import { PlanDiscount } from './entities/plan-discount.entity';
import { PlanDiscountsRepository } from './plan-discounts.repository';

@Injectable()
export class PlanDiscountsService {
  constructor(private readonly planDiscountsRepository: PlanDiscountsRepository) {}

  create(planId: number, createPlanDiscountDto: CreatePlanDiscountDto) {
    return this.planDiscountsRepository.orm
      .getManager()
      .createQueryBuilder(PlanDiscount, 'pd')
      .insert()
      .values({ ...createPlanDiscountDto, planId })
      .execute();
  }

  findAll(planId: number) {
    return this.planDiscountsRepository.orm.getManager().createQueryBuilder(PlanDiscount, 'pd').where('pd.planId = :planId', { planId }).getMany();
  }

  findOne(planId: number, planDiscountId: number) {
    return this.planDiscountsRepository.orm
      .getManager()
      .createQueryBuilder(PlanDiscount, 'pd')
      .where('pd.planId = :planId', { planId })
      .andWhere('pd.id = :planDiscountId', { planDiscountId })
      .getOne();
  }

  update(planId: number, planDiscountId: number, updatePlanDiscountDto: UpdatePlanDiscountDto) {
    return this.planDiscountsRepository.orm
      .getManager()
      .createQueryBuilder(PlanDiscount, 'pd')
      .update()
      .set(updatePlanDiscountDto)
      .where('pd.planId = :planId', { planId })
      .andWhere('pd.id = :planDiscountId', { planDiscountId })
      .execute();
  }

  remove(planId: number, planDiscountId: number) {
    return this.planDiscountsRepository.orm
      .getManager()
      .createQueryBuilder(PlanDiscount, 'pd')
      .delete()
      .where('pd.planId = :planId', { planId })
      .andWhere('pd.id = :planDiscountId', { planDiscountId })
      .execute();
  }
}
