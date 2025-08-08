import { Injectable } from '@nestjs/common';
import { CreatePlanDiscountDto } from './dto/create-plan-discount.dto';
import { UpdatePlanDiscountDto } from './dto/update-plan-discount.dto';
import { PlanDiscount } from './entities/plan-discount.entity';
import { PlanDiscountsRepository } from './plan-discounts.repository';

@Injectable()
export class PlanDiscountsService {
  constructor(private readonly planDiscountsRepository: PlanDiscountsRepository) {}

  create(createPlanDiscountDto: CreatePlanDiscountDto) {
    return this.planDiscountsRepository.orm.getManager().createQueryBuilder(PlanDiscount, 'pd').insert().values(createPlanDiscountDto).execute();
  }

  findAll() {
    return this.planDiscountsRepository.orm.getManager().createQueryBuilder(PlanDiscount, 'pd').getMany();
  }

  findOne(id: number) {
    return this.planDiscountsRepository.orm.getManager().createQueryBuilder(PlanDiscount, 'pd').where('pd.id = :id', { id }).getOne();
  }

  update(id: number, updatePlanDiscountDto: UpdatePlanDiscountDto) {
    return this.planDiscountsRepository.orm
      .getManager()
      .createQueryBuilder(PlanDiscount, 'pd')
      .update()
      .set(updatePlanDiscountDto)
      .where('pd.id = :id', { id })
      .execute();
  }

  remove(id: number) {
    return this.planDiscountsRepository.orm.getManager().createQueryBuilder(PlanDiscount, 'pd').delete().where('pd.id = :id', { id }).execute();
  }
}
