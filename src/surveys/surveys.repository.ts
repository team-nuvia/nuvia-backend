import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { SurveyStatus } from '@share/enums/survey-status';
import { OrmHelper } from '@util/orm.helper';
import { uniqueHash } from '@util/uniqueHash';
import { SurveySearchQueryParamDto } from './dto/param/survey-search-query.param.dto';
import { CreateSurveyPayloadDto } from './dto/payload/create-survey.payload.dto';
import { UpdateSurveyPayloadDto } from './dto/payload/update-survey.payload.dto';
import { DashboardSurveyNestedResponseDto } from './dto/response/dashboard-survey.nested.response.dto';
import { Survey } from './entities/survey.entity';
import { Question } from './questions/entities/question.entity';

@Injectable()
export class SurveysRepository extends BaseRepository {
  constructor(readonly orm: OrmHelper) {
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
