import { PlanGrantConstraintsType } from '@/plans/enums/plan-grant-constraints-type.enum';
import { NotFoundSubscriptionExceptionDto } from '@/subscriptions/dto/exception/not-found-subscription.exception.dto';
import { ValidateActionType } from '@common/variable/enums/validate-action-type.enum';
import { applyDecorators, CanActivate, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';
import { isNil } from '@util/isNil';
import { UtilRepository } from '@util/util.repository';

@Injectable()
export class SurveyRestoreConstraintGuard implements CanActivate {
  constructor(private readonly utilRepository: UtilRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const subscription = await this.utilRepository.getCurrentOrganization(user.id);

    if (isNil(subscription)) {
      throw new NotFoundSubscriptionExceptionDto();
    }

    /* 권한 검증 */
    this.utilRepository.surveyPermissionGrantsValidation(subscription, ValidateActionType.Delete);

    /* 플랜 제약사항 검증 */
    return new Promise(async (resolve, reject) => {
      const callback = (data: { [key in PlanGrantConstraintsType]: number }) => {
        if (PlanGrantConstraintsType.SurveyCreate in data) {
          resolve(true);
        }

        resolve(false);
      };
      try {
        await this.utilRepository.surveyPlanGrantsValidation(user.id, [PlanGrantConstraintsType.SurveyCreate], callback);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const SurveyRestoreConstraintValidation = () => {
  return applyDecorators(UseGuards(SurveyRestoreConstraintGuard));
};
