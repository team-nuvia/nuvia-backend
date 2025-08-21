import { PlanGrant } from '@/plans/plan-grants/entities/plan-grant.entity';
import { ValidateActionType } from '@common/variable/enums/validate-action-type.enum';
import { applyDecorators, CanActivate, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';
import { SubscriptionTargetType } from '@share/enums/subscription-target-type';
import { isNil } from '@util/isNil';
import { UtilRepository } from '@util/util.repository';
import { PlanGrantConstraintsType } from '../plans/enums/plan-grant-constraints-type.enum';
import { ExceededTeamInviteLimitExceptionDto } from './dto/exception/exceeded-team-invite-limit.exception.dto';
import { NotAllowedInviteExceptionDto } from './dto/exception/not-allowed-invite.exception.dto';
import { NotFoundSubscriptionExceptionDto } from './dto/exception/not-found-subscription.exception.dto';

@Injectable()
export class SubscriptionsInvitationConstraintGuard implements CanActivate {
  constructor(private readonly utilRepository: UtilRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const inviteUserEmails = request.body?.emails ?? [];

    const subscription = await this.utilRepository.getCurrentOrganization(user.id);

    if (isNil(subscription)) {
      throw new NotFoundSubscriptionExceptionDto();
    }

    /* 권한 검증 */
    /* Admin 이상 가능 */
    this.utilRepository.surveyPermissionGrantsValidation(subscription, ValidateActionType.Delete);

    if (subscription.target === SubscriptionTargetType.Individual) {
      throw new NotAllowedInviteExceptionDto('개인 구독자는 초대할 수 없습니다.');
    }

    /* 플랜 제약사항 검증 */
    return new Promise(async (resolve, reject) => {
      const callback = (data: { [key in PlanGrantConstraintsType]: { joinedUserCount: number; teamInviteLimitConstraint: PlanGrant } }) => {
        if (PlanGrantConstraintsType.TeamInvite in data) {
          const { joinedUserCount, teamInviteLimitConstraint } = data[PlanGrantConstraintsType.TeamInvite];
          if (inviteUserEmails.length + joinedUserCount > (teamInviteLimitConstraint?.amount ?? 0)) {
            reject(new ExceededTeamInviteLimitExceptionDto());
          }
          resolve(true);
        }
      };
      try {
        await this.utilRepository.teamInvitePlanGrantsValidation(subscription.id, [PlanGrantConstraintsType.TeamInvite], callback);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const SubscriptionsInvitationConstraintValidation = () => applyDecorators(UseGuards(SubscriptionsInvitationConstraintGuard));
