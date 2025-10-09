import { NotEnoughPermissionExceptionDto } from '@/permissions/dto/exception/not-enough-permission.exception.dto';
import { PlanGrantConstraintsType } from '@/plans/enums/plan-grant-constraints-type.enum';
import { NotFoundSubscriptionExceptionDto } from '@/subscriptions/dto/exception/not-found-subscription.exception.dto';
import { OrganizationRole } from '@/subscriptions/organization-roles/entities/organization-role.entity';
import { BaseRepository } from '@common/base.repository';
import { CommonService } from '@common/common.service';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { Injectable } from '@nestjs/common';
import { MetadataStatusType } from '@share/enums/metadata-status-type';
import { PlanGrantType } from '@share/enums/plan-grant-type.enum';
import { SurveyGraphType } from '@share/enums/survey-graph-type';
import { SurveyStatus } from '@share/enums/survey-status';
import { UserRole, UserRoleList } from '@share/enums/user-role';
import { User } from '@users/entities/user.entity';
import { DateFormat } from '@util/dateFormat';
import { getRangeOfMonth } from '@util/getRangeOfMonth';
import { isNil } from '@util/isNil';
import { OrmHelper } from '@util/orm.helper';
import { uniqueHash } from '@util/uniqueHash';
import { Brackets, FindOptionsWhere, In } from 'typeorm';
import { ClosedSurveyExceptionDto } from './dto/exception/closed-survey.exception.dto';
import { ExceededRestoreLimitExceptionDto } from './dto/exception/exceeded-restore-limit.exception.dto';
import { NoMatchSubscriptionExceptionDto } from './dto/exception/no-match-subscription.exception.dto';
import { NotFoundSurveyExceptionDto } from './dto/exception/not-found-survey.exception.dto';
import { SurveyGraphSearchQueryParamDto } from './dto/param/survey-graph-search-query.param.dto';
import { SurveyMetadataQueryParamDto } from './dto/param/survey-metadata-query.param.dto';
import { SurveySearchQueryParamDto } from './dto/param/survey-search-query.param.dto';
import { CreateSurveyPayloadDto } from './dto/payload/create-survey.payload.dto';
import { UpdateSurveyStatusPayloadDto } from './dto/payload/update-survey-status.payload.dto';
import { UpdateSurveyVisibilityPayloadDto } from './dto/payload/update-survey-visibility.payload.dto';
import { UpdateSurveyPayloadDto } from './dto/payload/update-survey.payload.dto';
import { DashboardRecentSurveyNestedResponseDto } from './dto/response/dashboard-recent-survey.nested.response.dto';
import { DashboardSurveyNestedResponseDto } from './dto/response/dashboard-survey.nested.response.dto';
import { GetCategoryNestedResponseDto } from './dto/response/get-category.nested.response.dto';
import { GetSurveyBinPaginatedNestedResponseDto } from './dto/response/get-survey-bin-paginated.nested.response.dto';
import { GetSurveyBinPaginatedResponseDto } from './dto/response/get-survey-bin.response.dto';
import { GetSurveyGraphNestedResponseDto } from './dto/response/get-survey-graph.nested.response.dto';
import { GetSurveyListNestedResponseDto } from './dto/response/get-survey-list.nested.response.dto';
import { ListResponseDto } from './dto/response/get-survey-list.response.dto';
import { MetadataDashboardSurveyNestedResponseDto } from './dto/response/metadata-dashboard-survey.nested.dto';
import { MetadataSurveyListNestedResponseDto } from './dto/response/metadata-survey-list.nested.response.dto';
import { SurveyDetailAnswerDetailNestedResponseDto } from './dto/response/survey-detail-answer-detail.nested.response.dto';
import { SurveyDetailViewNestedResponseDto } from './dto/response/survey-detail-view.nested.response.dto';
import { SurveyDetailNestedResponseDto } from './dto/response/survey-detail.nested.response.dto';
import { Answer } from './entities/answer.entity';
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

  async softDelete(id: number): Promise<void> {
    await this.orm.getRepo(Survey).softDelete(id);
  }

  existsByWithDeleted(condition: FindOptionsWhere<Survey>): Promise<boolean> {
    return this.orm.getRepo(Survey).exists({ where: condition, withDeleted: true });
  }

  existsBy(condition: FindOptionsWhere<Survey>): Promise<boolean> {
    return this.orm.getRepo(Survey).exists({ where: condition });
  }

  async createSurvey(subscriptionId: number, userId: number, createSurveyPayloadDto: CreateSurveyPayloadDto): Promise<number> {
    const hashedUniqueKey = uniqueHash();

    const subscription = await this.getCurrentOrganization(userId);

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
        expiresAt: createSurveyPayloadDto.expiresAt,
        isPublic: createSurveyPayloadDto.isPublic,
        status: createSurveyPayloadDto.status,
      })
      .execute();

    const surveyId = survey.identifiers[0].id as number;

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

    await this.calculateUsage(subscription.plan.id, userId);

    return surveyId;
  }

  async restoreSurvey(surveyId: number, userId: number): Promise<void> {
    const subscription = await this.getCurrentOrganization(userId);
    const monthlyUsage = await this.getMonthlyUsage(subscription.id);

    const planUsagePerMonth =
      subscription.plan.planGrants.find(
        (pg) => pg.isAllowed && pg.type === PlanGrantType.Limit && pg.constraints === PlanGrantConstraintsType.SurveyCreate,
      )?.amount ?? 0;

    const expectedSurveyCount = monthlyUsage + 1;
    const overUsage = expectedSurveyCount - planUsagePerMonth;

    if (expectedSurveyCount > planUsagePerMonth) {
      throw new ExceededRestoreLimitExceptionDto(overUsage.toString());
    }

    await this.orm
      .getManager()
      .createQueryBuilder()
      .update(Survey)
      .set({
        deletedAt: null,
        isPublic: false,
      })
      .where('id = :surveyId', { surveyId })
      .execute();

    await this.calculateUsage(subscription.plan.id, userId);
  }

  async restoreAllSurvey(userId: number): Promise<void> {
    const subscription = await this.getCurrentOrganization(userId);

    const monthlyUsage = await this.getMonthlyUsage(subscription.id);

    const deletedSurveyCount = await this.orm
      .getRepo(Survey)
      .createQueryBuilder('s')
      .withDeleted()
      .where('s.subscriptionId = :subscriptionId', { subscriptionId: subscription.id })
      .andWhere('s.deletedAt IS NOT NULL')
      .getCount();

    const planUsagePerMonth =
      subscription.plan.planGrants.find(
        (pg) => pg.isAllowed && pg.type === PlanGrantType.Limit && pg.constraints === PlanGrantConstraintsType.SurveyCreate,
      )?.amount ?? 0;

    const expectedSurveyCount = deletedSurveyCount + monthlyUsage;
    const overUsage = expectedSurveyCount - planUsagePerMonth;

    if (expectedSurveyCount > planUsagePerMonth) {
      throw new ExceededRestoreLimitExceptionDto(overUsage.toString());
    }

    await this.orm
      .getManager()
      .createQueryBuilder()
      .update(Survey)
      .set({
        deletedAt: null,
        isPublic: false,
      })
      .where('subscriptionId = :subscriptionId', { subscriptionId: subscription.id })
      .andWhere('deletedAt IS NOT NULL')
      .execute();

    await this.calculateUsage(subscription.plan.id, userId);
  }

  async getDeletedSurvey(userId: number, searchQuery: SurveySearchQueryParamDto): Promise<GetSurveyBinPaginatedResponseDto> {
    const { search, page, limit, status } = searchQuery;

    const subscription = await this.getCurrentOrganization(userId);

    const query = this.orm
      .getRepo(Survey)
      .createQueryBuilder('s')
      .withDeleted()
      .where('s.subscriptionId = :subscriptionId', { subscriptionId: subscription.id })
      .andWhere('s.deletedAt IS NOT NULL');

    if (search) {
      query.andWhere('s.title LIKE :search', { search: `%${search}%` });
    }

    if (status) {
      query.andWhere('s.status IN (:...status)', { status: status.split(',') as SurveyStatus[] });
    }

    const [surveyList, total] = await query.getManyAndCount();

    const composedSurveyList = surveyList.map<GetSurveyBinPaginatedNestedResponseDto>((survey) => ({
      id: survey.id,
      title: survey.title,
      description: survey.description,
      isPublic: survey.isPublic,
      status: survey.realtimeStatus,
      createdAt: survey.createdAt,
      updatedAt: survey.updatedAt,
      deletedAt: survey.deletedAt,
    }));

    return {
      page,
      limit,
      total,
      data: composedSurveyList,
    };
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
      .leftJoinAndSelect('s.questions', 'sq')
      .leftJoinAndSelect('sq.questionOptions', 'sqo')
      .leftJoinAndSelect('s.answers', 'sa')
      .leftJoinAndSelect('sa.user', 'u')
      .where('s.userId = :userId', { userId })
      .andWhere('s.subscriptionId = :subscriptionId', { subscriptionId: subscription.id });

    if (search) {
      query.andWhere('s.title LIKE :search', { search: `%${search}%` });
    }

    if (status) {
      query.andWhere('s.status IN (:...status)', { status: status.split(',') as SurveyStatus[] });
    }

    query
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
      status: survey.realtimeStatus,
      createdAt: survey.createdAt,
      updatedAt: survey.updatedAt,
    }));

    return composedSurveyList;
  }

  async getSurveyRespondentGraphData(userId: number, searchQuery: SurveyGraphSearchQueryParamDto): Promise<GetSurveyGraphNestedResponseDto[]> {
    const subscription = await this.getCurrentOrganization(userId);
    // const { startDate, endDate } = getRangeOfWeek();

    if (searchQuery.type === SurveyGraphType.Weekly) {
      // 지정된 기간의 모든 날짜 생성
      // const startDate = new Date(startDate);
      // const endDate = new Date(endDate);
      const allDates: string[] = [];

      for (let date = new Date(searchQuery.startDate); date <= new Date(searchQuery.endDate); date.setDate(date.getDate() + 1)) {
        allDates.push(date.toISOString().split('T')[0]);
      }
      // currentOrganization
      // 실제 데이터 조회
      const query = this.orm
        .getRepo(Answer)
        .createQueryBuilder('a')
        .leftJoin('a.survey', 's')
        .select(['DATE_FORMAT(a.createdAt, "%Y-%m-%d") as `date`', 'COUNT(a.createdAt) as count'])
        .where('s.subscriptionId = :subscriptionId', { subscriptionId: subscription.id });

      if (searchQuery.startDate) {
        query.andWhere('DATE(a.createdAt) >= :startDate', { startDate: searchQuery.startDate });
      }

      if (searchQuery.endDate) {
        query.andWhere('DATE(a.createdAt) <= :endDate', { endDate: searchQuery.endDate });
      }

      const rawDataList = await query.groupBy('DATE_FORMAT(a.createdAt, "%Y-%m-%d")').getRawMany();
      // 데이터 맵 생성
      const dataMap = new Map<string, number>();
      rawDataList.forEach((item) => {
        dataMap.set(item.date, +item.count);
      });

      // 모든 날짜에 대해 데이터 생성 (없는 날짜는 0으로 설정)
      const dataList = allDates.map((date) => ({
        date,
        count: dataMap.get(date) || 0,
      }));

      return dataList.map((data) => ({
        date: data.date,
        count: +data.count,
      }));
    }

    return [];
  }

  async getSurveyMetadata(
    userId: number,
    searchQuery: SurveyMetadataQueryParamDto,
  ): Promise<MetadataDashboardSurveyNestedResponseDto | MetadataSurveyListNestedResponseDto> {
    const subscription = await this.getCurrentOrganization(userId);

    if (isNil(subscription)) {
      throw new NotFoundSubscriptionExceptionDto();
    }

    const base = new Date();
    const year = base.getFullYear();
    const month = base.getMonth();
    const { currentFirstDay, currentLastDay } = getRangeOfMonth(year, month);

    const [surveyList, totalSurveyCount] = await this.orm
      .getManager()
      .createQueryBuilder(Survey, 's')
      .leftJoinAndSelect('s.questions', 'sq')
      .leftJoinAndSelect('s.answers', 'sa')
      .where('s.subscriptionId = :subscriptionId', { subscriptionId: subscription.id })
      .getManyAndCount();

    const totalRespondentCount = surveyList.reduce((acc, cur) => acc + cur.respondentCount, 0);

    if (searchQuery.status === MetadataStatusType.Dashboard) {
      const currentMonthSurveyCount = await this.orm
        .getManager()
        .createQueryBuilder(Survey, 's')
        .leftJoinAndSelect('s.questions', 'sq')
        .leftJoinAndSelect('s.answers', 'sa')
        .where('s.subscriptionId = :subscriptionId', { subscriptionId: subscription.id })
        .andWhere('s.createdAt >= :currentFirstDay', { currentFirstDay })
        .andWhere('s.createdAt <= :currentLastDay', { currentLastDay })
        .getCount();

      const planLimitPerMonth = subscription.plan.planGrants.find(
        (pg) => pg.isAllowed && pg.type === PlanGrantType.Limit && pg.constraints === PlanGrantConstraintsType.SurveyCreate,
      );

      const planUsagePerMonth = planLimitPerMonth?.amount ?? 0;

      const totalCompletedRespondentCount = surveyList.reduce(
        (acc, survey) => acc + survey.answers.reduce((acc, answer) => acc + (!isNil(answer.completedAt) ? 1 : 0), 0),
        0,
      );

      const metadata = {
        totalSurveyCount,
        totalRespondentCount,
        totalCompletedRespondentCount,
        planUsage: {
          plan: subscription.plan.name,
          usage: currentMonthSurveyCount,
          limit: planUsagePerMonth,
        },
      };
      return metadata as MetadataDashboardSurveyNestedResponseDto;
    } else {
      /* 진행중 또는 만료기간이 없거나 만료되지 않은 설문 개수 */
      const activeSurveyCount = surveyList.filter((survey) => survey.realtimeStatus === SurveyStatus.Active).length;

      const metadata = {
        totalSurveyCount,
        totalRespondentCount,
        activeSurveyCount,
        totalViewCount: surveyList.reduce((acc, survey) => acc + survey.viewCount, 0),
      } as MetadataSurveyListNestedResponseDto;
      return metadata;
    }
  }

  async getRecentSurvey(userId: number): Promise<DashboardRecentSurveyNestedResponseDto[]> {
    const subscription = await this.getCurrentOrganization(userId);

    const query = this.orm
      .getManager()
      .createQueryBuilder(Survey, 's')
      .leftJoinAndSelect('s.category', 'sc')
      .leftJoinAndSelect('s.questions', 'sq')
      .leftJoinAndSelect('s.answers', 'sa')
      .leftJoinAndSelect('s.user', 'u')
      .leftJoinAndSelect('u.userProviders', 'up2')
      .leftJoinAndSelect('u.profile', 'up')
      .where('s.subscriptionId = :subscriptionId', { subscriptionId: subscription.id });

    const surveyList = await query.orderBy('s.createdAt', 'DESC').getMany();

    return surveyList.map<DashboardRecentSurveyNestedResponseDto>((survey) => ({
      id: survey.id,
      category: {
        id: survey.category.id,
        name: survey.category.name,
      },
      hashedUniqueKey: survey.hashedUniqueKey,
      title: survey.title,
      description: survey.description,
      author: survey.user
        ? {
            id: survey.user.id,
            name: survey.user.userProvider.name,
            profileImage: survey.user.getProfileUrl(this.commonService),
          }
        : null,
      status: survey.realtimeStatus,
      responses: survey.respondentCount,
      expiresAt: survey.expiresAt,
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
      .leftJoinAndSelect('s.answers', 'sa')
      .leftJoinAndSelect('sa.user', 'u')
      .where('s.subscriptionId = :subscriptionId', { subscriptionId: subscription.id });

    if (search) {
      surveyQuery.andWhere('s.title LIKE :search', { search: `%${search}%` });
    }

    const statusList = status.split(',') as SurveyStatus[];
    const hasClosedStatus = statusList.includes(SurveyStatus.Closed);
    surveyQuery.andWhere(
      new Brackets((qb) => {
        const now = DateFormat.toUTC();
        if (statusList.length > 0) {
          qb.where('s.status IN (:...status)', { status: statusList });
        }
        if (hasClosedStatus) {
          qb.orWhere('(s.expiresAt IS NOT NULL AND s.expiresAt <= :now)', { now });
        } else {
          qb.andWhere('(s.expiresAt IS NULL OR s.expiresAt > :now)', { now });
        }
      }),
    );

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
      status: survey.realtimeStatus,
      viewCount: survey.viewCount,
      estimatedTime: survey.estimatedTime,
      questionAmount: survey.questions.length,
      responseAmount: survey.respondentCount,
      isExpired: survey.realtimeStatus === SurveyStatus.Closed,
      expiresAt: survey.expiresAt,
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
    await this.orm.getRepo(Survey).increment({ hashedUniqueKey }, 'viewCount', 1);
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
      .leftJoinAndSelect('sq.questionOptions', 'sqo', 'sqo.deletedAt IS NULL')
      .leftJoinAndSelect('s.answers', 'sa')
      .leftJoinAndSelect('u.userProviders', 'up2')
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
      author: survey.user
        ? { id: survey.user.id, name: survey.user.userProvider.name, profileImage: survey.user.getProfileUrl(this.commonService) }
        : null,
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

  async getSurveyDetailByHashedUniqueKey(
    hashedUniqueKey: string,
    submissionHash?: string,
    userId?: number,
  ): Promise<SurveyDetailViewNestedResponseDto> {
    const organizationRoles = userId ? await this.orm.getRepo(OrganizationRole).find({ where: { userId }, relations: ['subscription'] }) : [];

    const query = this.orm
      .getManager()
      .createQueryBuilder(Survey, 's')
      .leftJoinAndSelect('s.category', 'sc')
      .leftJoinAndSelect('s.user', 'u')
      .leftJoinAndSelect('u.profile', 'up')
      .leftJoinAndSelect('s.questions', 'sq')
      .leftJoinAndSelect('sq.questionOptions', 'sqo')
      .leftJoinAndSelect('s.answers', 'sas')
      .leftJoinAndMapOne('s.answer', Answer, 'sa', 'sa.surveyId = s.id AND sa.submissionHash = :submissionHash', { submissionHash })
      .leftJoinAndSelect('sa.questionAnswers', 'sqa')
      .leftJoinAndSelect('sqa.referenceBuffer', 'srb')
      .leftJoinAndSelect('u.userProviders', 'up2')
      .where('s.hashedUniqueKey = :hashedUniqueKey', { hashedUniqueKey });

    if (userId && organizationRoles.length > 0) {
      // 보려는 사용자가 해당 조직 일원이면, 공개 여부, 설문 상태 상관없이 보여야한다.
      query
        .andWhere('s.subscriptionId IN (:...subscriptionIds)', {
          subscriptionIds: organizationRoles.map((organizationRole) => organizationRole.subscriptionId),
        })
        .withDeleted();
    } else {
      // 보려는 사용자가 해당 조직 일원이 아니면, 공개 여부, 설문 상태 조건을 만족해야한다.
      query.andWhere('s.isPublic = :isPublic', { isPublic: true }).andWhere('s.status != :status', { status: SurveyStatus.Draft });
    }

    const survey = await query
      .orderBy('sq.id', 'ASC')
      .addOrderBy('sq.sequence', 'ASC')
      .addOrderBy('sqo.id', 'ASC')
      .addOrderBy('sqo.sequence', 'ASC')
      .getOne();

    if (isNil(survey)) {
      throw new NotFoundSurveyExceptionDto();
    }

    // const userIdOrNull = userId ?? null;

    /* 비회원, 조직 일원이 아닌 경우 */
    if (!(userId && organizationRoles.length > 0)) {
      if (survey.realtimeStatus !== SurveyStatus.Active) {
        throw new ClosedSurveyExceptionDto();
      }

      /* 설문 비공개 여부는 프라이빗한 정보로 판단 */
      // if (survey.isPublic === false) {
      //   throw new PrivateSurveyExceptionDto();
      // }
    }

    /* 해시 키로 조회한 설문이 유저꺼라면 userId가 없을 때 예외처리 */
    // if (!isNil(survey.userId) && isNil(userIdOrNull)) {
    //   throw new NotFoundSurveyExceptionDto();
    // }

    const answer = (survey as Survey & { answer: SurveyDetailAnswerDetailNestedResponseDto | null }).answer;
    const questionAnswers = (answer?.questionAnswers ?? []).map((questionAnswer) => ({
      id: questionAnswer.id,
      questionId: questionAnswer.questionId,
      questionOptionId: questionAnswer.questionOptionId,
      value: questionAnswer.value,
      referenceBuffer: questionAnswer.referenceBuffer
        ? {
            id: questionAnswer.referenceBuffer.id,
            originalname: questionAnswer.referenceBuffer.originalname,
            filename: questionAnswer.referenceBuffer.filename,
            mimetype: questionAnswer.referenceBuffer.mimetype,
            size: questionAnswer.referenceBuffer.size,
            buffer: Buffer.from(questionAnswer.referenceBuffer.buffer),
            createdAt: questionAnswer.referenceBuffer.createdAt,
          }
        : null,
    }));
    const questions = survey.questions.map((question) => ({
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
    }));
    const author = survey.user
      ? { id: survey.user.id, name: survey.user.userProvider.name, profileImage: survey.user.getProfileUrl(this.commonService) }
      : null;

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
      author,
      estimatedTime: survey.estimatedTime,
      totalResponses: survey.respondentCount,
      questions,
      questionAnswers,
      isPublic: survey.isPublic,
      status: survey.realtimeStatus,
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

  async updateSurveyStatus(surveyId: number, updateSurveyStatusPayloadDto: UpdateSurveyStatusPayloadDto): Promise<void> {
    await this.orm.getManager().update(Survey, surveyId, { status: updateSurveyStatusPayloadDto.status });
  }

  async updateSurvey(surveyId: number, userId: number, updateSurveyPayloadDto: UpdateSurveyPayloadDto): Promise<void> {
    // 권한 체크
    // 1. 설문을 작성한 사람의 조직과 현재 수정하려는 사람이 참여했는지 검증
    // 2. 해당 조직에서 수정 가능한 권한인지 검증
    const deleteQuestionQueue: number[] = [];
    const deleteQuestionOptionQueue: number[] = [];
    const createQuestionAndOptionQueue: ICreateQuestionAndOption[] = [];
    const updateQuestionQueue: IUpdateQuestion[] = [];
    const updateQuestionOptionQueue: IUpdateQuestionOption[] = [];

    /* 수정할 설문 정보 */
    const survey = await this.orm.getRepo(Survey).findOne({ where: { id: surveyId }, relations: { user: { subscriptions: true } } });

    if (!survey) {
      throw new NotFoundSurveyExceptionDto();
    }

    /* 수정 시도하는 사용자 정보 */
    const user = await this.orm.getRepo(User).findOne({
      where: { id: userId },
      relations: ['subscriptions', 'subscriptions.organizationRoles', 'organizationRoles', 'organizationRoles.permission'],
    });

    if (!user) {
      throw new NotFoundUserExceptionDto();
    }

    const subscription = await this.getCurrentOrganization(userId);

    /* 수정 시도하는 사용자와 동일 조직인지 검증 */
    if (survey.subscriptionId !== subscription.id) {
      throw new NoMatchSubscriptionExceptionDto();
    }

    /* 수정 시도하는 사용자의 조직 내 권한 검증 */
    const userRole = user.organizationRoles.find((role) => survey.user.subscriptions.some((subscription) => subscription.id === role.subscriptionId));
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
            .where('q.surveyId = :surveyId', { surveyId })
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
          surveyId,
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
          surveyId,
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
    console.log('🚀 ~ SurveysRepository ~ updateSurvey ~ createQuestionAndOptionQueue:', createQuestionAndOptionQueue);
    await this.orm.getRepo(Question).insert(createQuestionAndOptionQueue);

    /* 삭제할 질문 옵션 쿼리 실행 */
    const deleteTargetOptionList = await Promise.all(deleteTargetQueryQueue);
    deleteQuestionOptionQueue.push(...deleteTargetOptionList.flatMap((option) => option.map((option) => option.id)));

    /* upsert, delete, update 쿼리 실행 */
    await this.orm.getManager().softDelete(Question, { surveyId, id: In(deleteQuestionQueue) });
    await this.orm.getManager().softDelete(QuestionOption, { id: In(deleteQuestionOptionQueue) });

    /* 질문, 질문 옵션 수정 */
    await this.orm.getManager().upsert(Question, updateQuestionQueue, { conflictPaths: ['id'], skipUpdateIfNoValuesChanged: true });
    await this.orm.getManager().upsert(QuestionOption, updateQuestionOptionQueue, { conflictPaths: ['id'], skipUpdateIfNoValuesChanged: true });

    /* 설문 정보 수정 */
    await this.orm.getManager().update(
      Survey,
      { id: surveyId },
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
    const subscription = await this.getCurrentOrganization(userId);

    await this.orm.getManager().softDelete(Survey, { id: surveyId, subscriptionId: subscription.id });

    await this.calculateUsage(subscription.plan.id, userId);
  }
}
