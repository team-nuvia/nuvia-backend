import { NotFoundNotificationExceptionDto } from '@/notifications/dto/exception/not-found-notification.exception.dto';
import { ToggleReadNotificationPayloadDto } from '@/notifications/dto/payload/toggle-read-notification.payload.dto';
import { Notification } from '@/notifications/entities/notification.entity';
import { Permission } from '@/permissions/entities/permission.entity';
import { PlanGrantConstraintsType } from '@/plans/enums/plan-grant-constraints-type.enum';
import { NotFoundLogUsageExceptionDto } from '@/subscriptions/dto/exception/not-found-log-usage.exception.dto';
import { NotFoundSubscriptionExceptionDto } from '@/subscriptions/dto/exception/not-found-subscription.exception.dto';
import { LogUsageSubscription } from '@/subscriptions/entities/log-usage-subscription.entity';
import { Subscription } from '@/subscriptions/entities/subscription.entity';
import { NotFoundOrganizationRoleExceptionDto } from '@/subscriptions/organization-roles/dto/exception/not-found-organization-role.exception.dto';
import { GetUserOrganizationsNestedResponseDto } from '@/subscriptions/organization-roles/dto/response/get-user-organizations.nested.response.dto';
import { OrganizationDataNestedResponseDto } from '@/subscriptions/organization-roles/dto/response/organization-data.nested.response.dto';
import { OrganizationRole } from '@/subscriptions/organization-roles/entities/organization-role.entity';
import { Survey } from '@/surveys/entities/survey.entity';
import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';
import { SubscriptionStatusType } from '@share/enums/subscription-status-type';
import { UserRole } from '@share/enums/user-role';
import { getRangeOfMonth } from '@util/getRangeOfMonth';
import { isNil } from '@util/isNil';
import { isRoleAtLeast } from '@util/isRoleAtLeast';
import { OrmHelper } from '@util/orm.helper';
import { FindOptionsWhere, In } from 'typeorm';
import { ForbiddenAccessExceptionDto } from './dto/exception/forbidden-access.exception.dto';
import { AddNotificationPayloadDto } from './dto/payload/add-notification.payload.dto';
import { UpdateOrganizationRoleStatusPayloadDto } from './dto/payload/update-notification.payload.dto';
import { ValidateActionType } from './variable/enums/validate-action-type.enum';
import { NotificationType } from '@share/enums/notification-type';
import { User } from '@users/entities/user.entity';

export abstract class BaseRepository {
  constructor(protected readonly orm: OrmHelper) {}

  abstract existsBy<T>(condition: FindOptionsWhere<T>): Promise<boolean>;

  abstract existsByWithDeleted<T>(condition: FindOptionsWhere<T>): Promise<boolean>;

  abstract softDelete(id: number): Promise<void>;

  /**
   * 현재 조직 초기화
   * organizationRole이 없을 시에만 update 동작
   * 있으면 아무 동작하지 않고 다름 프로세스 진행
   * @param userId 사용자 ID
   */
  async initializeCurrentOrganization(userId: number) {
    const organizationRoles = await this.orm
      .getRepo(OrganizationRole)
      .createQueryBuilder('or')
      .leftJoinAndSelect('or.subscription', 's')
      .where('or.userId = :userId', { userId })
      .andWhere('s.status = :status', { status: SubscriptionStatusType.Active })
      .andWhere('or.status IN (:...orStatus)', { orStatus: [OrganizationRoleStatusType.Invited, OrganizationRoleStatusType.Joined] })
      .getMany();

    const counterMap = {
      true: 0,
      false: 0,
    };

    for (const role of organizationRoles) {
      counterMap[`${role.isCurrentOrganization}`]++;
    }

    if (counterMap['true'] === 1 && counterMap['false'] === organizationRoles.length - 1) {
      return;
    }

    const organizationRole = organizationRoles.find((role) => role.status === OrganizationRoleStatusType.Joined);

    if (organizationRole) {
      await this.orm
        .getRepo(OrganizationRole)
        .createQueryBuilder('or')
        .update()
        .set({ isCurrentOrganization: true })
        .where('id = :organizationRoleId', { organizationRoleId: organizationRole.id })
        .execute();
    }
  }

  async initializeUsageLog(planId: number, userId: number) {
    const subscription = await this.getCurrentOrganization(userId);

    const currentMonthLogUsage = await this.orm
      .getRepo(LogUsageSubscription)
      .createQueryBuilder('lus')
      .where('lus.planId = :planId', { planId })
      .andWhere('lus.userId = :userId', { userId })
      .andWhere('YEAR(lus.createdAt) = YEAR(CURRENT_DATE)')
      .andWhere('MONTH(lus.createdAt) = MONTH(CURRENT_DATE)')
      .getOne();

    if (!currentMonthLogUsage) {
      const monthlyUsage = await this.getMonthlyUsage(subscription.id);

      const planMaxSurveyCount =
        subscription.plan.planGrants.find((planGrant) => planGrant.constraints === PlanGrantConstraintsType.SurveyCreate && planGrant.isAllowed)
          ?.amount ?? 0;

      const remain = planMaxSurveyCount - monthlyUsage;

      await this.orm
        .getRepo(LogUsageSubscription)
        .save({ planId, userId, usage: monthlyUsage, remain, total: planMaxSurveyCount, target: subscription.target, status: subscription.status });
    }
  }

  getMonthlyUsage(subscriptionId: number) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const { currentFirstDay, currentLastDay } = getRangeOfMonth(year, month);

    return this.orm
      .getRepo(Survey)
      .createQueryBuilder('s')
      .where('s.subscriptionId = :subscriptionId', { subscriptionId: subscriptionId })
      .andWhere('s.createdAt BETWEEN :currentFirstDay AND :currentLastDay', { currentFirstDay, currentLastDay })
      .getCount();
  }

  async calculateUsage(planId: number, userId: number) {
    await this.initializeUsageLog(planId, userId);

    const currentMonthLogUsage = await this.orm
      .getRepo(LogUsageSubscription)
      .createQueryBuilder('lus')
      .where('lus.planId = :planId', { planId })
      .andWhere('lus.userId = :userId', { userId })
      .andWhere('YEAR(lus.createdAt) = YEAR(CURRENT_DATE)')
      .andWhere('MONTH(lus.createdAt) = MONTH(CURRENT_DATE)')
      .getOne();

    if (!currentMonthLogUsage) {
      throw new NotFoundLogUsageExceptionDto();
    }

    const subscription = await this.getCurrentOrganization(userId);

    const monthlyUsage = await this.getMonthlyUsage(subscription.id);

    const planMaxSurveyCount =
      subscription.plan.planGrants.find((planGrant) => planGrant.constraints === PlanGrantConstraintsType.SurveyCreate && planGrant.isAllowed)
        ?.amount ?? 0;

    const remain = planMaxSurveyCount - monthlyUsage;

    await this.orm
      .getRepo(LogUsageSubscription)
      .update(
        { id: currentMonthLogUsage.id },
        { usage: monthlyUsage, remain, total: planMaxSurveyCount, target: subscription.target, status: subscription.status },
      );
  }

  async getCurrentOrganization(userId: number): Promise<OrganizationDataNestedResponseDto> {
    await this.initializeCurrentOrganization(userId);

    const organizationRoles = await this.orm
      .getRepo(OrganizationRole)
      .createQueryBuilder('or')
      .leftJoinAndMapOne('or.subscription', Subscription, 's', 's.id = or.subscriptionId')
      .leftJoinAndSelect('s.plan', 'pl')
      .leftJoinAndSelect('pl.planGrants', 'plg')
      .leftJoinAndMapOne('s.permission', Permission, 'p', 'p.id = or.permissionId')
      .leftJoinAndSelect('p.permissionGrants', 'pmg')
      .where('or.userId = :userId', { userId })
      .getMany();

    const organizationRole = organizationRoles.find((organizationRole) => organizationRole.isCurrentOrganization);

    if (!organizationRole) {
      throw new NotFoundOrganizationRoleExceptionDto();
    }

    const subscription = (organizationRole as OrganizationRole & { subscription: Subscription & { permission: Permission } }).subscription;
    const permission = subscription.permission;
    const permissionGrants = permission.permissionGrants.map((permissionGrant) => ({
      id: permissionGrant.id,
      permissionId: permissionGrant.permissionId,
      type: permissionGrant.type,
      description: permissionGrant.description,
      isAllowed: permissionGrant.isAllowed,
      createdAt: permissionGrant.createdAt,
      updatedAt: permissionGrant.updatedAt,
    }));

    return {
      id: subscription.id,
      organizationId: organizationRole.id,
      name: subscription.name,
      description: subscription.description,
      role: permission.role,
      target: subscription.target,
      status: subscription.status,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
      plan: {
        id: subscription.plan.id,
        name: subscription.plan.name,
        description: subscription.plan.description,
        createdAt: subscription.plan.createdAt,
        updatedAt: subscription.plan.updatedAt,
        planGrants: subscription.plan.planGrants,
      },
      permission: {
        id: permission.id,
        role: permission.role,
        description: permission.description,
        sequence: permission.sequence,
        isDeprecated: permission.isDeprecated,
        isDefault: permission.isDefault,
        permissionGrants,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
      },
    };
  }

  async getUserOrganizations(userId: number): Promise<GetUserOrganizationsNestedResponseDto> {
    const currentOrganization = await this.getCurrentOrganization(userId);
    const organizationRoles = await this.orm
      .getRepo(OrganizationRole)
      .createQueryBuilder('or')
      .leftJoinAndSelect('or.subscription', 's')
      .leftJoinAndSelect('s.plan', 'pl')
      .leftJoinAndSelect('pl.planGrants', 'plg')
      .leftJoinAndMapOne('s.permission', Permission, 'p', 'p.id = or.permissionId')
      .leftJoinAndSelect('p.permissionGrants', 'pmg')
      .where('or.userId = :userId', { userId })
      .andWhere('or.status = :status', { status: OrganizationRoleStatusType.Joined})
      .andWhere('or.deletedAt IS NULL')
      .getMany();

    const organizations = organizationRoles.map<OrganizationDataNestedResponseDto>((organizationRole) => {
      const subscription = organizationRole.subscription as Subscription & { permission: Permission };
      const permission = subscription.permission;
      const permissionGrants = permission.permissionGrants.map((permissionGrant) => ({
        id: permissionGrant.id,
        permissionId: permissionGrant.permissionId,
        type: permissionGrant.type,
        description: permissionGrant.description,
        isAllowed: permissionGrant.isAllowed,
        createdAt: permissionGrant.createdAt,
        updatedAt: permissionGrant.updatedAt,
      }));

      return {
        id: subscription.id,
        organizationId: organizationRole.id,
        name: subscription.name,
        description: subscription.description,
        role: permission.role,
        target: subscription.target,
        status: subscription.status,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
        plan: {
          id: subscription.plan.id,
          name: subscription.plan.name,
          description: subscription.plan.description,
          createdAt: subscription.plan.createdAt,
          updatedAt: subscription.plan.updatedAt,
          planGrants: subscription.plan.planGrants,
        },
        permission: {
          id: permission.id,
          role: permission.role,
          description: permission.description,
          sequence: permission.sequence,
          isDeprecated: permission.isDeprecated,
          isDefault: permission.isDefault,
          permissionGrants,
          createdAt: permission.createdAt,
          updatedAt: permission.updatedAt,
        },
      };
    });
    return { currentOrganization, organizations };
  }

  /* 조직 내 액션 권한 검증 */
  surveyPermissionGrantsValidation(subscription: OrganizationDataNestedResponseDto, action: ValidateActionType) {
    switch (action) {
      case ValidateActionType.Create:
        if (!isRoleAtLeast(subscription.permission.role, UserRole.Editor)) {
          throw new ForbiddenAccessExceptionDto('설문 생성 권한이 없습니다.');
        }
        break;
      case ValidateActionType.Update:
        if (!isRoleAtLeast(subscription.permission.role, UserRole.Editor)) {
          throw new ForbiddenAccessExceptionDto('설문 수정 권한이 없습니다.');
        }
        break;
      case ValidateActionType.Delete:
        if (!isRoleAtLeast(subscription.permission.role, UserRole.Admin)) {
          throw new ForbiddenAccessExceptionDto('설문 삭제 권한이 없습니다.');
        }
        break;
      default:
        throw new ForbiddenAccessExceptionDto('설문 제어 권한이 없습니다.');
    }
  }

  organizationRolePermissionGrantsValidation(subscription: OrganizationDataNestedResponseDto, action: ValidateActionType) {
    switch (action) {
      case ValidateActionType.Update:
        if (!isRoleAtLeast(subscription.permission.role, UserRole.Editor)) {
          throw new ForbiddenAccessExceptionDto('조직 역할 수정 권한이 없습니다.');
        }
        break;
    }
  }

  /**
   * 플랜별 제약조건 검증 로직
   * callback 인자는 플랜 제약사항에 대해 즉시 검증 가능한 생성 개수 제한 외의 데이터 조회 후 추가적으로 검증이 필요할 때 사용된다.
   * 예를 들어, 생성하고자 하는 데이터의 하위 데이터 개수 제한의 경우 해당 데이터의 하위 데이터 개수는 DB에 저장되기 전인 상태여서, 코드레벨에서 검증 되어야 하기 때문이다.
   * @param userId 사용자 ID
   * @param planGrantConstraints 플랜 제약사항
   * @param callback 콜백 함수
   */
  /* 플랜별 액션 권한 검증 */
  async surveyPlanGrantsValidation<T extends (...args: any[]) => any>(
    userId: number,
    planGrantConstraints: PlanGrantConstraintsType[],
    callback?: T,
  ) {
    // 플랜 액션별 권한 검증 로직

    // 1. 플랜에 걸려있는 grant 조회
    // 2. 플랜 액션별 제약사항 검증
    // 3. 플랜 액션에 제약사항에 걸릴 시 예외 처리
    // 4. 제약사항에 걸리지 않으면 모두 통과

    // 필요 데이터: 사용자 플랜, 사용자 액션, 플랜 제약사항 별 검증 위한 데이터

    // const user = await this.orm
    //   .getRepo(User)
    //   .createQueryBuilder('u')
    //   .leftJoinAndSelect('u.subscription', 's')
    //   .leftJoinAndSelect('s.plan', 'pl')
    //   .leftJoinAndSelect('pl.planGrants', 'plg')
    //   .where('u.id = :userId', { userId })
    //   .getOne();

    // const subscription = await this.orm
    //   .getRepo(Subscription)
    //   .createQueryBuilder('s')
    //   .leftJoinAndSelect('s.plan', 'pl')
    //   .leftJoinAndSelect('pl.planGrants', 'plg')
    //   .where('s.id = :subscriptionId', { subscriptionId: user.subscription.id })
    //   .getOne();

    const subscription = await this.getCurrentOrganization(userId);

    /* 사용자 플랜 */
    const userPlan = subscription.plan;
    /* 현재 연도 */
    const year = new Date().getFullYear();
    /* 현재 월 */
    const month = new Date().getMonth();
    /* 이전, 이번 달의 첫 날, 마지막 날을 반환 */
    const { currentFirstDay, currentLastDay } = getRangeOfMonth(year, month);

    // TODO: 설문 Limit 도달 시 복구 할 때 새로운 검증 필요
    if (planGrantConstraints.includes(PlanGrantConstraintsType.SurveyCreate)) {
      /* 이번 달 생성된 설문 개수 조회 */
      const userSurveyCountAtMonth = await this.orm
        .getRepo(Survey)
        .createQueryBuilder('s')
        .where('s.subscriptionId = :subscriptionId', { subscriptionId: subscription.id })
        .andWhere('s.createdAt BETWEEN :currentFirstDay AND :currentLastDay', { currentFirstDay, currentLastDay })
        .getCount();

      const createSurveyLimitConstraint = userPlan.planGrants.find(
        (planGrant) => planGrant.constraints === PlanGrantConstraintsType.SurveyCreate && planGrant.isAllowed,
      );

      if (!isNil(createSurveyLimitConstraint?.amount) && createSurveyLimitConstraint.amount <= userSurveyCountAtMonth) {
        throw new ForbiddenAccessExceptionDto('최대 생성 가능한 설문 개수를 초과하였습니다.');
      }

      callback?.({ [PlanGrantConstraintsType.SurveyCreate]: userSurveyCountAtMonth });
    }

    /* 설문 응답 제약사항 검증 */
    if (planGrantConstraints.includes(PlanGrantConstraintsType.SurveyAnswerCreate)) {
      const surveyAnswerCreateAtMonth = userPlan.planGrants.find(
        (planGrant) => planGrant.constraints === PlanGrantConstraintsType.SurveyAnswerCreate && planGrant.isAllowed,
      );

      const allowSurveyAnswerCount = surveyAnswerCreateAtMonth?.amount ?? 0;

      callback?.({ [PlanGrantConstraintsType.SurveyAnswerCreate]: allowSurveyAnswerCount });
    }

    /* 설문 당 질문 최대 개수 검증 */
    if (planGrantConstraints.includes(PlanGrantConstraintsType.PerQuestionForSurvey)) {
      const perQuestionForSurveyAtMonth = userPlan.planGrants.find(
        (planGrant) => planGrant.constraints === PlanGrantConstraintsType.PerQuestionForSurvey && planGrant.isAllowed,
      );

      const allowPerQuestionForSurveyAmount = perQuestionForSurveyAtMonth?.amount ?? 0;

      callback?.({ [PlanGrantConstraintsType.PerQuestionForSurvey]: allowPerQuestionForSurveyAmount });
    }
  }

  async teamInvitePlanGrantsValidation<T extends (...args: any[]) => any>(
    subscriptionId: number,
    planGrantConstraints: PlanGrantConstraintsType[],
    callback?: T,
  ) {
    // 플랜 액션별 권한 검증 로직

    // 1. 플랜에 걸려있는 grant 조회
    // 2. 플랜 액션별 제약사항 검증
    // 3. 플랜 액션에 제약사항에 걸릴 시 예외 처리
    // 4. 제약사항에 걸리지 않으면 모두 통과

    // 필요 데이터: 사용자 플랜, 사용자 액션, 플랜 제약사항 별 검증 위한 데이터

    const subscription = await this.orm
      .getRepo(Subscription)
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.plan', 'pl')
      .leftJoinAndSelect('pl.planGrants', 'plg')
      .where('s.id = :subscriptionId', { subscriptionId })
      .getOne();

    if (isNil(subscription)) {
      throw new NotFoundSubscriptionExceptionDto();
    }

    /* 사용자 플랜 */
    const subscriptionPlan = subscription.plan;

    // TODO: 설문 Limit 도달 시 복구 할 때 새로운 검증 필요
    if (planGrantConstraints.includes(PlanGrantConstraintsType.TeamInvite)) {
      /* 초대 제약사항 검증 */
      const teamInviteLimitConstraint = subscriptionPlan.planGrants.find(
        (planGrant) => planGrant.constraints === PlanGrantConstraintsType.TeamInvite && planGrant.isAllowed,
      );

      if (!teamInviteLimitConstraint?.isAllowed) {
        throw new ForbiddenAccessExceptionDto('초대 가능한 플랜이 아닙니다.');
      }

      /* 이미 초대 된 사용자 수 조회 */
      /* 조직 내 사용정지, 초대 진행 중인 유저 또한 조직 인원으로 판단한다. */
      const joinedUserCount = await this.orm
        .getRepo(OrganizationRole)
        .createQueryBuilder('or')
        .where('or.subscriptionId = :subscriptionId', { subscriptionId })
        .andWhere('or.status IN (:...status)', {
          status: [OrganizationRoleStatusType.Joined, OrganizationRoleStatusType.Invited, OrganizationRoleStatusType.Deactivated],
        })
        .getCount();

      /* 초대 제약사항 검증 */
      if (!isNil(teamInviteLimitConstraint?.amount) && teamInviteLimitConstraint.amount <= joinedUserCount) {
        throw new ForbiddenAccessExceptionDto('최대 초대 가능한 사용자 수를 초과하였습니다.');
      }

      callback?.({
        [PlanGrantConstraintsType.TeamInvite]: {
          joinedUserCount,
          teamInviteLimitConstraint,
        },
      });
    }
  }

  async addNotification({ fromId, toId, type, referenceId, title, content }: AddNotificationPayloadDto) {
    return this.orm.getRepo(Notification).save({ fromId, toId, type, referenceId, title, content });
  }

  async addNotifications({
    subscriptionId,
    type,
    userId,
    emails,
    title,
    content,
  }: {
    subscriptionId: number;
    type: NotificationType;
    userId: number;
    emails: string[];
    title: string;
    content: string;
  }) {
    const fromOrganization = await this.orm.getRepo(Subscription).findOne({ where: { id: subscriptionId } });

    if (!fromOrganization) {
      throw new NotFoundSubscriptionExceptionDto();
    }

    const toUsers = await this.orm.getRepo(User).find({ where: { email: In(emails) }, select: ['id'] });

    await Promise.all(
      toUsers.map((to) =>
        this.addNotification({
          fromId: userId,
          toId: to.id,
          type,
          referenceId: subscriptionId,
          title,
          content,
        }),
      ),
    );
  }

  async toggleReadNotification(toId: number, notificationId: number, toggleReadNotificationDto: ToggleReadNotificationPayloadDto) {
    const notification = await this.orm.getRepo(Notification).findOne({ where: { id: notificationId, toId } });

    if (!notification) throw new NotFoundNotificationExceptionDto();

    await this.orm
      .getRepo(Notification)
      .update(notificationId, { isRead: toggleReadNotificationDto.isRead, actionStatus: toggleReadNotificationDto.actionStatus });
  }

  async updateOrganizationRoleStatus(organizationRoleId: number, updateOrganizationRoleStatusPayloadDto: UpdateOrganizationRoleStatusPayloadDto) {
    await this.orm.getRepo(OrganizationRole).update(organizationRoleId, updateOrganizationRoleStatusPayloadDto);
  }
}
