import { PlanGrantConstraintsType } from '@/plans/enums/plan-grant-constraints-type.enum';
import { PlanGrantType } from '@/plans/enums/plan-grant-type.enum';
import { NotFoundSubscriptionExceptionDto } from '@/subscriptions/dto/exception/not-found-subscription.exception.dto';
import { Subscription } from '@/subscriptions/entities/subscription.entity';
import { BaseRepository } from '@common/base.repository';
import { CommonService } from '@common/common.service';
import { Injectable } from '@nestjs/common';
import { SurveyStatus } from '@share/enums/survey-status';
import { isNil } from '@util/isNil';
import { OrmHelper } from '@util/orm.helper';
import { uniqueHash } from '@util/uniqueHash';
import { NotFoundSurveyExceptionDto } from './dto/exception/not-found-survey.exception.dto';
import { SurveySearchQueryParamDto } from './dto/param/survey-search-query.param.dto';
import { CreateSurveyPayloadDto } from './dto/payload/create-survey.payload.dto';
import { UpdateSurveyPayloadDto } from './dto/payload/update-survey.payload.dto';
import { DashboardRecentSurveyNestedResponseDto } from './dto/response/dashboard-recent-survey.nested.response.dto';
import { DashboardSurveryMetadataNestedResponseDto } from './dto/response/dashboard-survery-metadata.nested.dto';
import { DashboardSurveyNestedResponseDto } from './dto/response/dashboard-survey.nested.response.dto';
import { GetSurveyListNestedResponseDto } from './dto/response/get-survey-list.nested.response.dto';
import { ListResponseDto } from './dto/response/get-survey-list.response.dto';
import { SurveyDetailNestedResponseDto } from './dto/response/survey-detail.nested.response.dto';
import { Survey } from './entities/survey.entity';
import { Question } from './questions/entities/question.entity';

@Injectable()
export class SurveysRepository extends BaseRepository {
  constructor(
    readonly orm: OrmHelper,
    readonly commonService: CommonService,
  ) {
    super(orm);
  }

  async createSurvey(userId: number, createSurveyPayloadDto: CreateSurveyPayloadDto) {
    console.log('🚀 ~ SurveysRepository ~ createSurvey ~ createSurveyPayloadDto:', createSurveyPayloadDto);
    const hashedUniqueKey = uniqueHash();
    await this.orm
      .getManager()
      .createQueryBuilder()
      .insert()
      .into('survey')
      .values({
        userId,
        hashedUniqueKey,
        title: createSurveyPayloadDto.title,
        description: createSurveyPayloadDto.description,
        expiresAt: createSurveyPayloadDto.expiresAt ?? new Date(),
        isPublic: createSurveyPayloadDto.isPublic,
        status: createSurveyPayloadDto.status,
      })
      .execute();
  }

  async getSurvey(userId: number, searchQuery: SurveySearchQueryParamDto): Promise<DashboardSurveyNestedResponseDto[]> {
    const { search, page, limit, status } = searchQuery;

    const query = this.orm.getManager().createQueryBuilder(Survey, 's').where('s.userId = :userId', { userId });

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
      .where('s.userId = :userId', { userId })
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

    const subscription = await this.orm
      .getManager()
      .createQueryBuilder(Subscription, 's')
      .leftJoinAndSelect('s.plan', 'p')
      .leftJoinAndSelect('p.planGrants', 'pg')
      .where('s.userId = :userId', { userId })
      .getOne();

    if (isNil(subscription)) {
      throw new NotFoundSubscriptionExceptionDto();
    }

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
    const surveyList = await this.orm
      .getManager()
      .createQueryBuilder(Survey, 's')
      .leftJoinAndSelect('s.questions', 'sq')
      .leftJoinAndSelect('sq.questionAnswers', 'sqa')
      .where('s.userId = :userId', { userId })
      .orderBy('s.createdAt', 'DESC')
      .getMany();
    return surveyList.map((survey) => ({
      id: survey.id,
      title: survey.title,
      description: survey.description,
      status: survey.status,
      responses: survey.respondentCount,
      createdAt: survey.createdAt,
      updatedAt: survey.updatedAt,
    }));
  }

  async getSurveyList(userId: number, searchQuery: SurveySearchQueryParamDto): Promise<ListResponseDto> {
    const { search, page, limit, status } = searchQuery;
    console.log('🚀 ~ SurveysRepository ~ getSurveyList ~ searchQuery:', searchQuery);

    const surveyQuery = this.orm
      .getManager()
      .createQueryBuilder(Survey, 's')
      .leftJoinAndSelect('s.questions', 'sq')
      .leftJoinAndSelect('sq.questionAnswers', 'sqa')
      .leftJoinAndSelect('sqa.user', 'u')
      .where('s.userId = :userId', { userId });

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
      category: survey.category,
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

  async getSurveyDetail(userId: number, id: number): Promise<SurveyDetailNestedResponseDto> {
    const survey = await this.orm
      .getManager()
      .createQueryBuilder(Survey, 's')
      .leftJoinAndSelect('s.user', 'u')
      .leftJoinAndSelect('u.profile', 'up')
      .leftJoinAndSelect('s.questions', 'sq')
      .leftJoinAndSelect('sq.questionOptions', 'sqo')
      .leftJoinAndSelect('sq.questionAnswers', 'sqa')
      .where('s.userId = :userId', { userId })
      .andWhere('s.id = :id', { id })
      .getOne();

    if (isNil(survey)) {
      throw new NotFoundSurveyExceptionDto();
    }

    await this.orm
      .getManager()
      .createQueryBuilder(Survey, 's')
      .update()
      .set({
        viewCount: () => 'viewCount + 1',
      })
      .where('s.id = :id', { id })
      .execute();

    return {
      id: survey.id,
      title: survey.title,
      description: survey.description,
      author: { name: survey.user.name, profileImage: survey.user.getProfileUrl(this.commonService) },
      estimatedTime: survey.estimatedTime,
      totalResponses: survey.respondentCount,
      questions: survey.questions.map((question) => ({
        id: question.id,
        title: question.title,
        description: question.description,
        isRequired: Boolean(question.isRequired),
        questionType: question.questionType,
        dataType: question.dataType,
        options: question.questionOptions.map((option) => ({
          id: option.id,
          label: option.label,
        })),
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

  async updateSurvey(id: number, updateSurveyPayloadDto: UpdateSurveyPayloadDto): Promise<void> {
    const surveyFormData = updateSurveyPayloadDto.surveyFormData;
    const surveyQuestionDataList = updateSurveyPayloadDto.surveyQuestionData;

    await this.orm.getManager().transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.update(Survey, id, surveyFormData);

      for (const surveyQuestionData of surveyQuestionDataList) {
        await transactionalEntityManager.update(Question, surveyQuestionData.id, surveyQuestionData);
      }
    });
  }
}
