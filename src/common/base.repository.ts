import { Permission } from '@/permissions/entities/permission.entity';
import { PlanGrantConstraintsType } from '@/plans/enums/plan-grant-constraints-type.enum';
import { Subscription } from '@/subscriptions/entities/subscription.entity';
import { NotFoundOrganizationRoleExceptionDto } from '@/subscriptions/organization-roles/dto/exception/not-found-organization-role.exception.dto';
import { GetUserOrganizationsNestedResponseDto } from '@/subscriptions/organization-roles/dto/response/get-user-organizations.nested.response.dto';
import { OrganizationRole } from '@/subscriptions/organization-roles/entities/organization-role.entity';
import { Survey } from '@/surveys/entities/survey.entity';
import { UserRole } from '@share/enums/user-role';
import { User } from '@users/entities/user.entity';
import { getRangeOfMonth } from '@util/getRangeOfMonth';
import { isNil } from '@util/isNil';
import { isRoleAtLeast } from '@util/isRoleAtLeast';
import { OrmHelper } from '@util/orm.helper';
import { FindOptionsWhere } from 'typeorm';
import { ForbiddenAccessExceptionDto } from './dto/exception/forbidden-access.exception.dto';
import { NotFoundUserExceptionDto } from './dto/exception/not-found-user.exception.dto';
import { ValidateActionType } from './variable/enums/validate-action-type.enum';

export abstract class BaseRepository {
  constructor(protected readonly orm: OrmHelper) {}

  abstract existsBy<T>(condition: FindOptionsWhere<T>): Promise<boolean>;

  abstract existsByWithDeleted<T>(condition: FindOptionsWhere<T>): Promise<boolean>;

  abstract softDelete(id: number): Promise<void>;

  async getCurrentOrganization(userId: number): Promise<Subscription & { permission: Permission }> {
    const organizationRole = await this.orm
      .getRepo(OrganizationRole)
      .createQueryBuilder('or')
      .leftJoinAndSelect('or.subscription', 's')
      .leftJoinAndSelect('s.plan', 'pl')
      .leftJoinAndSelect('pl.planGrants', 'plg')
      .leftJoinAndMapOne('s.permission', Permission, 'p', 'p.id = or.permissionId')
      .leftJoinAndSelect('p.permissionGrants', 'pmg')
      .where('or.userId = :userId', { userId })
      .andWhere('or.isActive = 1')
      .getOne();

    if (!organizationRole) {
      throw new NotFoundOrganizationRoleExceptionDto();
    }

    return organizationRole.subscription as Subscription & { permission: Permission };
  }

  async getUserOrganizations(userId: number): Promise<GetUserOrganizationsNestedResponseDto> {
    const organizationRoles = await this.orm
      .getRepo(OrganizationRole)
      .createQueryBuilder('or')
      .leftJoinAndSelect('or.subscription', 's')
      .where('or.userId = :userId', { userId })
      .getMany();

    const currentOrganization: Subscription = await this.getCurrentOrganization(userId);

    const organizations = organizationRoles.map((organizationRole) => organizationRole.subscription);
    return { currentOrganization, organizations };
  }

  /* 조직 내 액션 권한 검증 */
  surveyPermissionGrantsValidation(subscription: Subscription & { permission: Permission }, action: ValidateActionType) {
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

    const user = await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.subscription', 's')
      .leftJoinAndSelect('s.plan', 'pl')
      .leftJoinAndSelect('pl.planGrants', 'plg')
      .where('u.id = :userId', { userId })
      .getOne();

    if (isNil(user)) {
      throw new NotFoundUserExceptionDto();
    }

    /* 사용자 플랜 */
    const userPlan = user.subscription.plan;
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
        .where('s.subscriptionId = :subscriptionId', { subscriptionId: user.subscription.id })
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
}
