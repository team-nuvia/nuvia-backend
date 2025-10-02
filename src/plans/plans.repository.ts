import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { PlanNameType } from '@share/enums/plan-name-type.enum';
import { OrmHelper } from '@util/orm.helper';
import { FindOptionsWhere } from 'typeorm';
import { GetPlansNestedResponseDto } from './dto/response/get-plans.nested.response.dto';
import { Plan } from './entities/plan.entity';
import { PlanGrantConstraintsType } from './enums/plan-grant-constraints-type.enum';

@Injectable()
export class PlansRepository extends BaseRepository {
  constructor(orm: OrmHelper) {
    super(orm);
  }

  async softDelete(id: number): Promise<void> {
    await this.orm.getRepo(Plan).softDelete(id);
  }

  existsByWithDeleted(condition: FindOptionsWhere<Plan>): Promise<boolean> {
    return this.orm.getRepo(Plan).exists({ where: condition, withDeleted: true });
  }

  existsBy(condition: FindOptionsWhere<Plan>): Promise<boolean> {
    return this.orm.getRepo(Plan).exists({ where: condition });
  }

  async findAll(): Promise<GetPlansNestedResponseDto[]> {
    const plans = await this.orm
      .getRepo(Plan)
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.planGrants', 'pg', 'pg.isAllowed = true')
      .leftJoinAndSelect(
        'p.planDiscounts',
        'pd',
        'pd.isDeprecated = false AND pd.startDate <= NOW() AND pd.endDate >= NOW() AND pd.deletedAt IS NULL',
      )
      .getMany();

    const composedPlans = plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      period: 'monthly',
      features: plan.planGrants.map((pg) => {
        const constraints = [PlanGrantConstraintsType.TeamInvite, PlanGrantConstraintsType.PerResponseForSurvey] as string[];
        const unit = pg.constraints && constraints.includes(pg.constraints) ? ' 명' : ' 개';
        return `${pg.description?.replace(/수|제한/g, '').trim()}${pg.amount ? ` ${pg.amount.toLocaleString()} ${unit}` : ''}`.trim();
      }),
      planDiscounts: plan.planDiscounts.map((pd) => ({
        id: pd.id,
        name: pd.name,
        type: pd.type,
        discountAmount: pd.discountAmount,
        discountPercentage: pd.discountPercentage,
      })),
      buttonText: plan.name === PlanNameType.Free ? '무료로 시작하기' : '준비 중',
    }));

    return composedPlans;
  }

  findOne(id: number): Promise<Plan | null> {
    return this.orm.getRepo(Plan).findOne({ where: { id } });
  }
}
