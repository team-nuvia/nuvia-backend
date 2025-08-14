import { NotEnoughPermissionExceptionDto } from '@/permissions/dto/exception/not-enough-permission.exception.dto';
import { PlanGrantConstraintsType } from '@/plans/enums/plan-grant-constraints-type.enum';
import { PlanGrantType } from '@/plans/enums/plan-grant-type.enum';
import { NotFoundSubscriptionExceptionDto } from '@/subscriptions/dto/exception/not-found-subscription.exception.dto';
import { BaseRepository } from '@common/base.repository';
import { CommonService } from '@common/common.service';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { Injectable } from '@nestjs/common';
import { SurveyStatus } from '@share/enums/survey-status';
import { UserRole, UserRoleList } from '@share/enums/user-role';
import { User } from '@users/entities/user.entity';
import { isNil } from '@util/isNil';
import { OrmHelper } from '@util/orm.helper';
import { uniqueHash } from '@util/uniqueHash';
import { DeleteResult, FindOptionsWhere, In } from 'typeorm';
import { NoMatchSubscriptionExceptionDto } from './dto/exception/no-match-subscription.exception.dto';
import { NotFoundSurveyExceptionDto } from './dto/exception/not-found-survey.exception.dto';
import { SurveySearchQueryParamDto } from './dto/param/survey-search-query.param.dto';
import { CreateSurveyPayloadDto } from './dto/payload/create-survey.payload.dto';
import { UpdateSurveyVisibilityPayloadDto } from './dto/payload/update-survey-visibility.payload.dto';
import { UpdateSurveyPayloadDto } from './dto/payload/update-survey.payload.dto';
import { DashboardRecentSurveyNestedResponseDto } from './dto/response/dashboard-recent-survey.nested.response.dto';
import { DashboardSurveryMetadataNestedResponseDto } from './dto/response/dashboard-survery-metadata.nested.dto';
import { DashboardSurveyNestedResponseDto } from './dto/response/dashboard-survey.nested.response.dto';
import { GetCategoryNestedResponseDto } from './dto/response/get-category.nested.response.dto';
import { GetSurveyListNestedResponseDto } from './dto/response/get-survey-list.nested.response.dto';
import { ListResponseDto } from './dto/response/get-survey-list.response.dto';
import { SurveyDetailNestedResponseDto } from './dto/response/survey-detail.nested.response.dto';
import { Category } from './entities/category.entity';
import { Survey } from './entities/survey.entity';
import { Question } from './questions/entities/question.entity';
import { QuestionOption } from './questions/options/entities/question-option.entity';

@Injectable()
export class SurveysRepository extends BaseRepository {
  constructor(
    readonly orm: OrmHelper,
    readonly commonService: CommonService,
  ) {
    super(orm);
  }

  softDelete(id: number): Promise<DeleteResult> {
    return this.orm.getRepo(Survey).softDelete(id);
  }

  existsByWithDeleted(condition: FindOptionsWhere<Survey>): Promise<boolean> {
    return this.orm.getRepo(Survey).exists({ where: condition, withDeleted: true });
  }

  existsBy(condition: FindOptionsWhere<Survey>): Promise<boolean> {
    return this.orm.getRepo(Survey).exists({ where: condition });
  }

  // async getCurrentSubscription(userId: number) {
  //   const organizationRole = await this.orm
  //     .getRepo(OrganizationRole)
  //     .findOne({ where: { userId, isActive: true }, relations: { subscription: true } });

  //   if (!organizationRole) {
  //     throw new NotFoundOrganizationRoleExceptionDto();
  //   }

  //   return organizationRole.subscription;
  // }

  async createSurvey(subscriptionId: number, userId: number, createSurveyPayloadDto: CreateSurveyPayloadDto) {
    const hashedUniqueKey = uniqueHash();

    const survey = await this.orm
      .getManager()
      .createQueryBuilder()
      .insert()
      .into(Survey)
      .values({
        subscriptionId,
        userId,
        hashedUniqueKey,
        categoryId: createSurveyPayloadDto.categoryId,
        title: createSurveyPayloadDto.title,
        description: createSurveyPayloadDto.description,
        expiresAt: createSurveyPayloadDto.expiresAt ?? new Date(),
        isPublic: createSurveyPayloadDto.isPublic,
        status: createSurveyPayloadDto.status,
      })
      .execute();

    const surveyId = survey.identifiers[0].id;

    const questions = createSurveyPayloadDto.questions.map((question) => ({
      surveyId,
      title: question.title,
      description: question.description,
      questionType: question.questionType,
      dataType: question.dataType,
      isRequired: question.isRequired,
      sequence: question.sequence,
      questionOptions: question.questionOptions.map((questionOption) => ({
        label: questionOption.label,
        description: questionOption.description,
        sequence: questionOption.sequence,
      })),
    }));

    await this.orm.getManager().save(Question, questions);
  }

  getSurveyCategories(): Promise<GetCategoryNestedResponseDto[]> {
    return this.orm.getRepo(Category).createQueryBuilder('c').select(['c.id', 'c.name']).getMany();
  }

  async getSurvey(userId: number, searchQuery: SurveySearchQueryParamDto): Promise<DashboardSurveyNestedResponseDto[]> {
    const { search, page, limit, status } = searchQuery;

    const subscription = await this.getCurrentOrganization(userId);

    const query = this.orm
      .getManager()
      .createQueryBuilder(Survey, 's')
      .where('s.userId = :userId', { userId })
      .andWhere('s.subscriptionId = :subscriptionId', { subscriptionId: subscription.id });

    if (search) {
      query.andWhere('s.title LIKE :search', { search: `%${search}%` });
    }

    if (status) {
      query.andWhere('s.status IN (:...status)', { status: status.split(',') as SurveyStatus[] });
    }

    query
      .leftJoinAndSelect('s.questions', 'sq')
      .leftJoinAndSelect('sq.questionOptions', 'sqo')
      .leftJoinAndSelect('sq.questionAnswers', 'sqa')
      .leftJoinAndSelect('sqa.user', 'u')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('s.createdAt', 'DESC');

    const surveyList = await query.getMany();

    const composedSurveyList = surveyList.map<DashboardSurveyNestedResponseDto>((survey) => ({
      id: survey.id,
      category: {
        id: survey.category.id,
        name: survey.category.name,
      },
      title: survey.title,
      description: survey.description,
      questionCount: survey.questions.length,
      respondentCount: survey.respondentCount,
      expiresAt: survey.expiresAt,
      isPublic: survey.isPublic,
      status: survey.status,
      createdAt: survey.createdAt,
      updatedAt: survey.updatedAt,
    }));

    return composedSurveyList;
  }

  async getSurveyMetadata(userId: number): Promise<DashboardSurveryMetadataNestedResponseDto> {
    const subscription = await this.getCurrentOrganization(userId);

    if (isNil(subscription)) {
      throw new NotFoundSubscriptionExceptionDto();
    }

    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const prevMonthFirstDay = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const prevMonthLastDay = new Date(year, month, 0, 23, 59, 59, 999);
    const monthFirstDay = new Date(year, month, 1, 0, 0, 0, 0);
    const monthLastDay = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const [surveyList, totalSurveyCount] = await this.orm
      .getManager()
      .createQueryBuilder(Survey, 's')
      .leftJoinAndSelect('s.questions', 'sq')
      .leftJoinAndSelect('sq.questionAnswers', 'sqa')
      .where('s.subscriptionId = :subscriptionId', { subscriptionId: subscription.id })
      .getManyAndCount();

    const surveyListPerMonth = surveyList.filter((survey) => {
      const surveyCreatedAt = new Date(survey.createdAt);
      return surveyCreatedAt >= monthFirstDay && surveyCreatedAt <= monthLastDay;
    });

    const prevSurveyListPerMonth = surveyList.filter((survey) => {
      const surveyCreatedAt = new Date(survey.createdAt);
      return surveyCreatedAt >= prevMonthFirstDay && surveyCreatedAt <= prevMonthLastDay;
    });

    const currentMonthRespondentCount = surveyListPerMonth.reduce((acc, survey) => acc + survey.respondentCount, 0);

    const previousMonthRespondentCount = prevSurveyListPerMonth.reduce((acc, survey) => acc + survey.respondentCount, 0);

    const totalRespondentCount = surveyList.reduce((acc, survey) => acc + survey.respondentCount, 0);

    const planLimitPerMonth = subscription.plan.planGrants.find(
      (pg) => pg.isAllowed && pg.type === PlanGrantType.Limit && pg.constraints === PlanGrantConstraintsType.SurveyCreate,
    );

    const planUsagePerMonth = planLimitPerMonth?.amount ?? 0;

    return {
      totalSurveyCount,
      totalRespondentCount,
      respondentIncreaseRate: {
        previousMonthRespondentCount,
        currentMonthRespondentCount,
      },
      planUsage: {
        plan: subscription.plan.name,
        usage: currentMonthRespondentCount,
        limit: planUsagePerMonth,
      },
    };
  }

  async getRecentSurvey(userId: number): Promise<DashboardRecentSurveyNestedResponseDto[]> {
    const subscription = await this.getCurrentOrganization(userId);

    const surveyList = await this.orm
      .getManager()
      .createQueryBuilder(Survey, 's')
      .leftJoinAndSelect('s.category', 'sc')
      .leftJoinAndSelect('s.questions', 'sq')
      .leftJoinAndSelect('sq.questionAnswers', 'sqa')
      .where('s.subscriptionId = :subscriptionId', { subscriptionId: subscription.id })
      .orderBy('s.createdAt', 'DESC')
      .getMany();

    return surveyList.map<DashboardRecentSurveyNestedResponseDto>((survey) => ({
      id: survey.id,
      category: {
        id: survey.category.id,
        name: survey.category.name,
      },
      hashedUniqueKey: survey.hashedUniqueKey,
      title: survey.title,
      description: survey.description,
      status: survey.status,
      responses: survey.respondentCount,
      createdAt: survey.createdAt,
      updatedAt: survey.updatedAt,
    }));
  }

  async getSurveyList(userId: number, searchQuery: SurveySearchQueryParamDto): Promise<ListResponseDto> {
    const subscription = await this.getCurrentOrganization(userId);

    const { search, page, limit, status } = searchQuery;

    const surveyQuery = this.orm
      .getManager()
      .createQueryBuilder(Survey, 's')
      .leftJoinAndSelect('s.category', 'sc')
      .leftJoinAndSelect('s.questions', 'sq')
      .leftJoinAndSelect('sq.questionAnswers', 'sqa')
      .leftJoinAndSelect('sqa.user', 'u')
      // .where('s.userId = :userId', { userId });
      .where('s.subscriptionId = :subscriptionId', { subscriptionId: subscription.id });

    if (search) {
      surveyQuery.andWhere('s.title LIKE :search', { search: `%${search}%` });
    }

    if (status !== 'all') {
      surveyQuery.andWhere('s.status IN (:...status)', { status: status.split(',') as SurveyStatus[] });
    }

    const [surveyList, total] = await surveyQuery
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('s.createdAt', 'DESC')
      .getManyAndCount();

    const composedSurveyList = surveyList.map<GetSurveyListNestedResponseDto>((survey) => ({
      id: survey.id,
      title: survey.title,
      description: survey.description,
      hashedUniqueKey: survey.hashedUniqueKey,
      category: {
        id: survey.category.id,
        name: survey.category.name,
      },
      isPublic: survey.isPublic,
      status: survey.status,
      viewCount: survey.viewCount,
      estimatedTime: survey.estimatedTime,
      questionAmount: survey.questions.length,
      responseAmount: survey.respondentCount,
      createdAt: survey.createdAt,
      updatedAt: survey.updatedAt,
    }));

    return {
      page,
      limit,
      total,
      data: composedSurveyList,
    };
  }

  async viewCountUpdate(hashedUniqueKey: string): Promise<void> {
    await this.orm
      .getManager()
      .createQueryBuilder()
      .update(Survey)
      .set({
        viewCount: () => 'viewCount + 1',
      })
      .where('hashedUniqueKey = :hashedUniqueKey', { hashedUniqueKey })
      .execute();
  }

  async getSurveyDetail(surveyId: number, userId?: number): Promise<SurveyDetailNestedResponseDto> {
    const subscription = userId ? await this.getCurrentOrganization(userId) : null;

    const query = this.orm
      .getManager()
      .createQueryBuilder(Survey, 's')
      .leftJoinAndSelect('s.category', 'sc')
      .leftJoinAndSelect('s.user', 'u')
      .leftJoinAndSelect('u.profile', 'up')
      .leftJoinAndSelect('s.questions', 'sq')
      .leftJoinAndSelect('sq.questionOptions', 'sqo')
      .leftJoinAndSelect('sq.questionAnswers', 'sqa')
      .where('s.id = :surveyId', { surveyId });

    if (subscription) {
      query.andWhere('s.subscriptionId = :subscriptionId', { subscriptionId: subscription.id });
    }

    const survey = await query.getOne();

    if (isNil(survey)) {
      throw new NotFoundSurveyExceptionDto();
    }

    return {
      id: survey.id,
      hashedUniqueKey: survey.hashedUniqueKey,
      subscriptionId: survey.subscriptionId,
      category: {
        id: survey.category.id,
        name: survey.category.name,
      },
      viewCount: survey.viewCount,
      title: survey.title,
      description: survey.description,
      author: survey.user ? { id: survey.user.id, name: survey.user.name, profileImage: survey.user.getProfileUrl(this.commonService) } : null,
      estimatedTime: survey.estimatedTime,
      totalResponses: survey.respondentCount,
      questions: survey.questions.map((question) => ({
        id: question.id,
        title: question.title,
        description: question.description,
        isRequired: Boolean(question.isRequired),
        questionType: question.questionType,
        dataType: question.dataType,
        questionOptions: question.questionOptions.map((option) => ({
          id: option.id,
          label: option.label,
          description: option.description,
          sequence: option.sequence,
        })),
        sequence: question.sequence,
      })),
      isPublic: survey.isPublic,
      status: survey.status,
      questionCount: survey.questions.length,
      respondentCount: survey.respondentCount,
      isOwner: survey.userId === userId,
      expiresAt: survey.expiresAt,
      createdAt: survey.createdAt,
      updatedAt: survey.updatedAt,
    };
  }

  async getSurveyDetailByHashedUniqueKey(hashedUniqueKey: string): Promise<SurveyDetailNestedResponseDto> {
    const query = this.orm
      .getManager()
      .createQueryBuilder(Survey, 's')
      .leftJoinAndSelect('s.category', 'sc')
      .leftJoinAndSelect('s.user', 'u')
      .leftJoinAndSelect('u.profile', 'up')
      .leftJoinAndSelect('s.questions', 'sq')
      .leftJoinAndSelect('sq.questionOptions', 'sqo')
      .leftJoinAndSelect('sq.questionAnswers', 'sqa')
      .where('s.hashedUniqueKey = :hashedUniqueKey', { hashedUniqueKey });

    const survey = await query
      .orderBy('sq.id', 'ASC')
      .addOrderBy('sq.sequence', 'ASC')
      .addOrderBy('sqo.id', 'ASC')
      .addOrderBy('sqo.sequence', 'ASC')
      .getOne();

    if (isNil(survey)) {
      throw new NotFoundSurveyExceptionDto();
    }

    return {
      id: survey.id,
      hashedUniqueKey: survey.hashedUniqueKey,
      subscriptionId: survey.subscriptionId,
      category: {
        id: survey.category.id,
        name: survey.category.name,
      },
      viewCount: survey.viewCount,
      title: survey.title,
      description: survey.description,
      author: survey.user ? { id: survey.user.id, name: survey.user.name, profileImage: survey.user.getProfileUrl(this.commonService) } : null,
      estimatedTime: survey.estimatedTime,
      totalResponses: survey.respondentCount,
      questions: survey.questions.map((question) => ({
        id: question.id,
        title: question.title,
        description: question.description,
        isRequired: Boolean(question.isRequired),
        questionType: question.questionType,
        dataType: question.dataType,
        questionOptions: question.questionOptions.map((option) => ({
          id: option.id,
          label: option.label,
          description: option.description,
          sequence: option.sequence,
        })),
        sequence: question.sequence,
      })),
      isPublic: survey.isPublic,
      status: survey.status,
      questionCount: survey.questions.length,
      respondentCount: survey.respondentCount,
      isOwner: survey.hashedUniqueKey === hashedUniqueKey,
      expiresAt: survey.expiresAt,
      createdAt: survey.createdAt,
      updatedAt: survey.updatedAt,
    };
  }

  async toggleSurveyVisibility(surveyId: number, updateSurveyVisibilityPayloadDto: UpdateSurveyVisibilityPayloadDto): Promise<void> {
    await this.orm.getManager().update(Survey, surveyId, { isPublic: updateSurveyVisibilityPayloadDto.isPublic });
  }

  async updateSurvey(id: number, userId: number, updateSurveyPayloadDto: UpdateSurveyPayloadDto): Promise<void> {
    // 권한 체크
    // 1. 설문을 작성한 사람의 조직과 현재 수정하려는 사람이 참여했는지 검증
    // 2. 해당 조직에서 수정 가능한 권한인지 검증
    const deleteQuestionQueue: number[] = [];
    const deleteQuestionOptionQueue: number[] = [];
    const createQuestionAndOptionQueue: ICreateQuestionAndOption[] = [];
    const updateQuestionQueue: IUpdateQuestion[] = [];
    const updateQuestionOptionQueue: IUpdateQuestionOption[] = [];

    /* 수정할 설문 정보 */
    const survey = await this.orm.getRepo(Survey).findOne({ where: { id }, relations: { user: { subscription: true } } });

    if (!survey) {
      throw new NotFoundSurveyExceptionDto();
    }

    /* 수정 시도하는 사용자 정보 */
    const user = await this.orm.getRepo(User).findOne({
      where: { id: userId },
      relations: ['subscription', 'subscription.organizationRoles', 'organizationRoles', 'organizationRoles.permission'],
    });

    if (!user) {
      throw new NotFoundUserExceptionDto();
    }

    /* 수정 시도하는 사용자와 동일 조직인지 검증 */
    if (survey.user.subscription.id !== user.subscription.id) {
      throw new NoMatchSubscriptionExceptionDto();
    }

    /* 수정 시도하는 사용자의 조직 내 권한 검증 */
    const userRole = user.organizationRoles.find((role) => role.subscriptionId === survey.user.subscription.id);
    if (userRole && UserRoleList.indexOf(userRole.permission.role) < UserRoleList.indexOf(UserRole.Editor)) {
      throw new NotEnoughPermissionExceptionDto();
    }

    /* 설문 폼 데이터 */
    const surveyFormData = updateSurveyPayloadDto.surveyFormData;

    /* 설문 질문 데이터 */
    const surveyQuestionDataList = updateSurveyPayloadDto.surveyQuestionData;

    /* 수정할 질문 아이디 리스트 */
    const updateIdList = surveyQuestionDataList.map((question) => question.id).filter((id) => !isNil(id));

    /* 삭제할 질문 리스트 */
    const deleteTargetQuestionList =
      updateIdList.length > 0
        ? await this.orm
            .getManager()
            .createQueryBuilder(Question, 'q')
            .where('q.surveyId = :surveyId', { surveyId: id })
            .andWhere('q.id NOT IN (:...updateIdList)', { updateIdList })
            .getMany()
        : [];
    deleteQuestionQueue.push(...deleteTargetQuestionList.map((question) => question.id));

    /* 삭제, 수정할 질문 옵션 쿼리 생성 */
    const deleteTargetQueryQueue: Promise<QuestionOption[]>[] = [];
    for (const question of surveyQuestionDataList) {
      /* 수정할 질문 데이터 */
      if (isNil(question.id)) {
        const createQuestion = {
          surveyId: id,
          title: question.title,
          description: question.description,
          questionType: question.questionType,
          dataType: question.dataType,
          isRequired: question.isRequired,
          sequence: question.sequence,
          questionOptions: question.questionOptions.map((questionOption) => ({
            label: questionOption.label,
            sequence: questionOption.sequence,
          })),
        };
        createQuestionAndOptionQueue.push(createQuestion);
      } else {
        const updateQuestion = {
          id: question.id as number,
          surveyId: id,
          title: question.title,
          description: question.description,
          questionType: question.questionType,
          dataType: question.dataType,
          isRequired: question.isRequired,
          sequence: question.sequence,
        };
        updateQuestionQueue.push(updateQuestion);

        /* 수정할 질문 옵션 데이터 */
        const updateQuestionOptionList = question.questionOptions.map((questionOption) => ({
          id: questionOption.id as number,
          questionId: question.id as number,
          label: questionOption.label,
          sequence: questionOption.sequence,
        }));
        updateQuestionOptionQueue.push(...updateQuestionOptionList);

        /* 삭제할 질문 옵션 쿼리 생성 */
        const questionOptionIdList = question.questionOptions.map((questionOption) => questionOption.id).filter((id) => !isNil(id));
        if (questionOptionIdList.length > 0) {
          deleteTargetQueryQueue.push(
            this.orm
              .getManager()
              .createQueryBuilder(QuestionOption, 'qo')
              .where('qo.questionId = :questionId', { questionId: question.id })
              .andWhere('qo.id NOT IN (:...questionOptionIdList)', { questionOptionIdList })
              .getMany(),
          );
        }
      }
    }

    /* 질문, 질문 옵션 추가 */
    await this.orm.getManager().save(Question, createQuestionAndOptionQueue);

    /* 삭제할 질문 옵션 쿼리 실행 */
    const deleteTargetOptionList = await Promise.all(deleteTargetQueryQueue);
    deleteQuestionOptionQueue.push(...deleteTargetOptionList.flatMap((option) => option.map((option) => option.id)));

    /* upsert, delete, update 쿼리 실행 */
    await this.orm.getManager().softDelete(Question, { surveyId: id, id: In(deleteQuestionQueue) });
    await this.orm.getManager().softDelete(QuestionOption, { questionId: In(deleteQuestionOptionQueue) });

    /* 질문, 질문 옵션 수정 */
    await this.orm.getManager().upsert(Question, updateQuestionQueue, { conflictPaths: ['id'], skipUpdateIfNoValuesChanged: true });
    await this.orm.getManager().upsert(QuestionOption, updateQuestionOptionQueue, { conflictPaths: ['id'], skipUpdateIfNoValuesChanged: true });

    /* 설문 정보 수정 */
    await this.orm.getManager().update(
      Survey,
      { id },
      {
        userId,
        categoryId: surveyFormData.categoryId,
        title: surveyFormData.title,
        description: surveyFormData.description,
        expiresAt: surveyFormData.expiresAt,
        isPublic: surveyFormData.isPublic,
        status: surveyFormData.status,
      },
    );
  }

  async deleteSurvey(surveyId: number, userId: number): Promise<void> {
    await this.orm.getManager().softDelete(Survey, { id: surveyId, userId });
  }
}
