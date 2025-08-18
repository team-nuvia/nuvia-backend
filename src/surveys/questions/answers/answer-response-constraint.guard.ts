import { PlanGrantConstraintsType } from '@/plans/enums/plan-grant-constraints-type.enum';
import { NotFoundSubscriptionExceptionDto } from '@/subscriptions/dto/exception/not-found-subscription.exception.dto';
import { ForbiddenAccessExceptionDto } from '@common/dto/exception/forbidden-access.exception.dto';
import { applyDecorators, CanActivate, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';
import { isNil } from '@util/isNil';
import { UtilRepository } from '@util/util.repository';

@Injectable()
export class AnswerResponseConstraintGuard implements CanActivate {
  constructor(private readonly utilRepository: UtilRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const subscription = await this.utilRepository.getCurrentOrganization(user.id);

    if (isNil(subscription)) {
      throw new NotFoundSubscriptionExceptionDto();
    }

    /* 플랜 제약사항 검증 */
    return new Promise(async (resolve, reject) => {
      const callback = (data: { [key in PlanGrantConstraintsType]: number }) => {
        if (PlanGrantConstraintsType.SurveyAnswerCreate in data) {
          if (request.body.answers.length <= data[PlanGrantConstraintsType.SurveyAnswerCreate]) {
            resolve(true);
          } else {
            reject(new ForbiddenAccessExceptionDto('최대 응답 가능한 질문 개수를 초과하였습니다.'));
          }
        }

        resolve(false);
      };
      try {
        await this.utilRepository.surveyPlanGrantsValidation(user.id, [PlanGrantConstraintsType.SurveyAnswerCreate], callback);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const AnswerResponseConstraintValidation = () => {
  return applyDecorators(UseGuards(AnswerResponseConstraintGuard));
};
