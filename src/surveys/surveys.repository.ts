import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyStatus } from '@share/enums/survey-status';
import { uniqueHash } from '@util/uniqueHash';
import { Repository } from 'typeorm';
import { SurveySearchQueryParamDto } from './dto/param/survey-search-query.param.dto';
import { CreateSurveyPayloadDto } from './dto/payload/create-survey.payload.dto';
import { UpdateSurveyPayloadDto } from './dto/payload/update-survey.payload.dto';
import { DashboardSurveyNestedResponseDto } from './dto/response/dashboard-survey.nested.response.dto';
import { Survey } from './entities/survey.entity';
import { Question } from './questions/entities/question.entity';

@Injectable()
export class SurveysRepository extends BaseRepository<Survey> {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
  ) {
    super(surveyRepository);
  }

  async createSurvey(userId: number, createSurveyPayloadDto: CreateSurveyPayloadDto) {
    console.log('🚀 ~ SurveysRepository ~ createSurvey ~ createSurveyPayloadDto:', createSurveyPayloadDto);
    const hashedUniqueKey = uniqueHash();
    const survey = this.surveyRepository.create({
      ...createSurveyPayloadDto,
      userId,
      hashedUniqueKey,
      expiresAt: createSurveyPayloadDto.expiresAt ?? new Date(),
    });
    console.log('🚀 ~ SurveysRepository ~ createSurvey ~ survey:', survey);
    await this.surveyRepository.save(survey);
  }

  async getSurvey(userId: number, searchQuery: SurveySearchQueryParamDto): Promise<DashboardSurveyNestedResponseDto[]> {
    const { search, page, limit, status } = searchQuery;

    const query = this.surveyRepository.createQueryBuilder('s').where('s.userId = :userId', { userId });

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

    await this.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.update(Survey, id, surveyFormData);

      for (const surveyQuestionData of surveyQuestionDataList) {
        await transactionalEntityManager.update(Question, surveyQuestionData.id, surveyQuestionData);
      }
    });
  }
}
