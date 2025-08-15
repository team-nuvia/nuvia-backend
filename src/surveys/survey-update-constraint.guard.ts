import { PlanGrantConstraintsType } from '@/plans/enums/plan-grant-constraints-type.enum';
import { NotFoundSubscriptionExceptionDto } from '@/subscriptions/dto/exception/not-found-subscription.exception.dto';
import { ForbiddenAccessExceptionDto } from '@common/dto/exception/forbidden-access.exception.dto';
import { ValidateActionType } from '@common/variable/enums/validate-action-type.enum';
import { applyDecorators, CanActivate, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';
import { isNil } from '@util/isNil';
import { UtilRepository } from '@util/util.repository';

@Injectable()
export class SurveyUpdateConstraintGuard implements CanActivate {
  constructor(private readonly utilRepository: UtilRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const subscription = await this.utilRepository.getCurrentOrganization(user.id);

    if (isNil(subscription)) {
      throw new NotFoundSubscriptionExceptionDto();
    }

    /* 권한 검증 */
    this.utilRepository.surveyPermissionGrantsValidation(subscription, ValidateActionType.Update);

    /* 플랜 제약사항 검증 */
    return new Promise(async (resolve, reject) => {
      const callback = (data: { [key in PlanGrantConstraintsType]: number }) => {
        if (PlanGrantConstraintsType.PerQuestionForSurvey in data) {
          if (request.body.surveyQuestionData.length <= data[PlanGrantConstraintsType.PerQuestionForSurvey]) {
            resolve(true);
          } else {
            reject(new ForbiddenAccessExceptionDto('최대 생성 가능한 질문 개수를 초과하였습니다.'));
          }
        }

        resolve(false);
      };
      try {
        await this.utilRepository.surveyPlanGrantsValidation(user.id, [PlanGrantConstraintsType.PerQuestionForSurvey], callback);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const SurveyUpdateConstraintValidation = () => applyDecorators(UseGuards(SurveyUpdateConstraintGuard));
