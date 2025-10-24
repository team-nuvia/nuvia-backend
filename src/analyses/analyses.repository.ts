import { NotFoundSurveyExceptionDto } from '@/surveys/dto/exception/not-found-survey.exception.dto';
import { Answer } from '@/surveys/entities/answer.entity';
import { Survey } from '@/surveys/entities/survey.entity';
import { QuestionAnswer } from '@/surveys/questions/answers/entities/question-answer.entity';
import { Question } from '@/surveys/questions/entities/question.entity';
import { QuestionOption } from '@/surveys/questions/options/entities/question-option.entity';
import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import { OrmHelper } from '@util/orm.helper';
import { ProcessingService } from '@util/processing.service';
import { FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { DailyTrendResponseDto } from './dto/response/daily-trend.response.dto';
import { OverviewAnalysisNestedResponseDto } from './dto/response/overview-analysis.nested.response.response.dto';
import { OverviewStatesResponseDto } from './dto/response/overview-states.response.dto';
import {
  BinNestedResponseDto,
  BucketNestedResponseDto,
  DistributionNestedResponseDto,
  QuestionDetailNestedResponseDto,
  SampleNestedResponseDto,
} from './dto/response/question-detail.nested.response.dto';
import { UserAllowedPermissionNestedResponseDto } from './dto/response/user-allowed-permission.nested.response.dto';
import { PermissionGrantType } from '@/permissions/enums/permission-grant-type.enum';
import { NotFoundOrganizationRoleExceptionDto } from '@/subscriptions/organization-roles/dto/exception/not-found-organization-role.exception.dto';
import { isNil } from '@util/isNil';
import { OrganizationRole } from '@/subscriptions/organization-roles/entities/organization-role.entity';
import { isRoleAtLeast } from '@util/isRoleAtLeast';
import { UserRole } from '@share/enums/user-role';

@Injectable()
export class AnalysesRepository extends BaseRepository {
  constructor(
    readonly orm: OrmHelper,
    readonly processingService: ProcessingService,
  ) {
    super(orm);
  }

  existsBy<T extends ObjectLiteral>(condition: FindOptionsWhere<T>, Model?: new () => T): Promise<boolean> {
    if (Model) return this.orm.getRepo(Model).exists({ where: condition });
    return Promise.resolve(false);
  }

  existsByWithDeleted<T extends ObjectLiteral>(condition: FindOptionsWhere<T>, Model?: new () => T): Promise<boolean> {
    if (Model) return this.orm.getRepo(Model).exists({ where: condition, withDeleted: true });
    return Promise.resolve(false);
  }

  async softDelete<T extends ObjectLiteral>(id: number, Model?: new () => T): Promise<void> {
    if (Model) this.orm.getRepo(Model).softDelete(id);
  }

  async getUserAllowedPermission(userId: number): Promise<UserAllowedPermissionNestedResponseDto> {
    const subscription = await this.getCurrentOrganization(userId);

    if (isNil(subscription)) {
      throw new NotFoundOrganizationRoleExceptionDto();
    }

    const downloadGrant = subscription.permission.permissionGrants.find(
      (permissionGrant) => permissionGrant.type === PermissionGrantType.DownloadReport,
    );

    const organizationRole = await this.orm
      .getRepo(OrganizationRole)
      .createQueryBuilder('or')
      .leftJoinAndSelect('or.permission', 'p')
      .where('or.userId = :userId', { userId })
      .andWhere('or.subscriptionId = :subscriptionId', { subscriptionId: subscription.id })
      .getOne();

    if (isNil(organizationRole)) {
      throw new NotFoundOrganizationRoleExceptionDto();
    }

    const isAllowed = isRoleAtLeast(organizationRole.permission.role, UserRole.Editor);

    const isAllowedDownload = (downloadGrant?.isAllowed ?? false) && isAllowed;

    return {
      download: {
        excel: isAllowedDownload,
        pdf: isAllowedDownload,
      },
    };
  }

  async getOverviewAnalysis(surveyId: number, subscriptionId: number): Promise<OverviewAnalysisNestedResponseDto> {
    // 문제점 1: 최근 30일과 이전 30일을 계산하는 서브쿼리의 where절이 잘못되어 데이터가 항상 0이 나옴
    //   .where('a.createdAt >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)')
    //   .andWhere('a.createdAt < DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)')
    //   -> 위 구문에서 두 조건이 같은 날짜를 가리키므로 항상 0건이 됨.
    //      curr30, prev30 각각 기간이 정확히 1개월씩 차이나게 조건을 걸어야 함.
    //
    // 문제점 2: 'a.deletedAt IS NULL'를 전체 where에서 사용하고 있는데,
    //   leftJoin된 a로 하면 서브쿼리의 카운트와 메인 totalResponses가 불일치할 수 있다.
    //
    // 문제점 3: completionRate 계산시 'completed.count * 100.0 / NULLIF(totalResponses, 0)'로 했는데,
    //   completed.count와 totalResponses가 모두 실제 데이터와 다를 수 있음(조인 방식, 조건 등).
    //
    // 문제점 4: avgResponsesPerSurvey는 단일 설문 통계에서는 의미 없음(항상 1개 설문 기준임).
    //
    // 아래는 각 문제에 대한 주석 추가 및 개선 아이디어입니다.
    const surveyRaw = await this.orm
      .getRepo(Survey)
      .createQueryBuilder('s')
      .leftJoin('s.answers', 'a')
      .select('s.id', 'surveyId')
      .addSelect('s.title', 'title')
      // 전체 응답 수 (soft delete가 아닌 답변만)
      .addSelect('COUNT(a.id)', 'totalResponses')
      // (문제2) avgResponsesPerSurvey는 단일 설문에선 사실상 무의미. 다른 목적이면 별도 쿼리가 필요함.
      .addSelect('AVG(a.id)', 'avgResponsesPerSurvey')
      // 최근 30일 및 그 이전 30일 응답수 비교 (문제1)
      // prev30.count가 0일 때 0을 반환하는데,
      // prev30.count와 curr30.count가 모두 NULL일 때도 결과가 의도치 않게 0이 될 수 있으므로,
      // NULL 처리에 주의할 것. 또한 음수 성장률/분모 0에 대한 추가 처리 필요함.
      .addSelect(
        `CASE
          WHEN prev30.count IS NULL OR prev30.count = 0 THEN 0
          ELSE ROUND((COALESCE(curr30.count, 0) - prev30.count) * 100.0 / prev30.count, 1)
        END`,
        'growth30dRate',
      )
      // (문제1) curr30: 최근 30일간의 응답수
      .leftJoin(
        (qb) =>
          qb
            .select('a.surveyId', 'surveyId')
            .addSelect('COUNT(a.id)', 'count')
            .from('answer', 'a')
            .where('a.createdAt >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)')
            .andWhere('a.createdAt < CURRENT_DATE') // <--- 두 번째 조건 수정, 1달 전 ~ 오늘
            .groupBy('a.surveyId'),
        'curr30',
        'curr30.surveyId = s.id',
      )
      // (문제1) prev30: 이전 30일(1달~2달전까지) 응답수
      .leftJoin(
        (qb) =>
          qb
            .select('a.surveyId', 'surveyId')
            .addSelect('COUNT(a.id)', 'count')
            .from('answer', 'a')
            .where('a.createdAt >= DATE_SUB(CURRENT_DATE, INTERVAL 2 MONTH)')
            .andWhere('a.createdAt < DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)')
            .groupBy('a.surveyId'),
        'prev30',
        'prev30.surveyId = s.id',
      )
      // 응답 완료 비율: 응답 완료 상태의 답변 / 전체 답변
      .addSelect(
        // (문제3) 서브쿼리 내 completed.count와 메인 totalResponses 기준이 다를 수 있음
        `CASE WHEN completed.count IS NULL OR completed.count = 0 THEN 0 ELSE ROUND(completed.count * 100.0 / NULLIF(COUNT(a.id), 0), 1) END`,
        'completionRate',
      )
      // (문제3) completed: 해당 survey에서 응답 완료된 답변 개수(삭제되지 않은 것만)
      .leftJoin(
        (qb) =>
          qb
            .select('a.surveyId', 'surveyId')
            .addSelect('COUNT(a.id)', 'count')
            .from('answer', 'a')
            .where('a.completedAt IS NOT NULL')
            .andWhere('a.deletedAt IS NULL')
            .groupBy('a.surveyId'),
        'completed',
        'completed.surveyId = s.id',
      )
      .where('s.id = :surveyId', { surveyId })
      .andWhere('s.subscriptionId = :subscriptionId', { subscriptionId })
      .andWhere('a.deletedAt IS NULL') // (문제2) 전체 총합과 서브쿼리 조건 맞추기
      .getRawOne();

    if (!surveyRaw) {
      throw new NotFoundSurveyExceptionDto();
    }

    // 0인 날도 모두 포함해서 일별 카운트를 가져오기 위해 날짜 테이블을 만듭니다.
    // MySQL 기준 최근 30일간의 날짜 리스트를 만들고, LEFT JOIN으로 연결합니다.
    const dailyTrendRaw: DailyTrendResponseDto[] = await this.orm.getRepo(Answer).query(
      // TODO: 추후 기간 받아오게 되면 생성일시보다 긴 기간은 생성일시 기준으로 연산
      `
        WITH RECURSIVE date_series AS (
          SELECT DATE_FORMAT((SELECT created_at FROM answer WHERE survey_id = ? ORDER BY created_at ASC LIMIT 1), '%Y-%m-%d') AS date_val
          UNION ALL
          SELECT DATE_ADD(date_val, INTERVAL 1 DAY)
          FROM date_series
          WHERE DATE_ADD(date_val, INTERVAL 1 DAY) <= CURDATE()
        )
        SELECT
          ds.date_val AS date,
          COUNT(a.id) AS count
        FROM date_series ds
        LEFT JOIN answer a
          ON DATE(a.created_at) = ds.date_val
        LEFT JOIN survey s
          ON a.survey_id = s.id
        GROUP BY ds.date_val
        ORDER BY ds.date_val
        `,
      [surveyId, subscriptionId],
    );

    const dailyTrend: DailyTrendResponseDto[] = dailyTrendRaw.map((item) => ({
      date: item.date,
      count: +item.count,
    }));

    const stats: OverviewStatesResponseDto = {
      totalResponses: +surveyRaw.totalResponses,
      avgResponsesPerSurvey: +surveyRaw.avgResponsesPerSurvey,
      growth30dRate: +surveyRaw.growth30dRate,
      completionRate: +surveyRaw.completionRate,
    };

    return {
      surveyId: surveyRaw.id,
      title: surveyRaw.title,
      periodLabel: '최근 30일', // TODO: 기간 받아서 라벨 생성
      stats,
      dailyTrend,
    };
  }

  getQuestionDistribution(
    questionType: QuestionType,
    dataType: DataType,
    questionOptions: QuestionOption[],
    questionAnswers: QuestionAnswer[],
  ): DistributionNestedResponseDto {
    const isSelectTypeList = [QuestionType.SingleChoice, QuestionType.MultipleChoice] as QuestionType[];
    const isIncludeBucketTypeList = [DataType.Rating] as DataType[];
    const bucketList = isSelectTypeList.includes(questionType) || isIncludeBucketTypeList.includes(dataType);
    const isTypeList = !bucketList;
    const binsList = [DataType.Time] as DataType[];

    const isBinType = binsList.includes(dataType);

    const buckets = bucketList ? this.getBucket(dataType, questionOptions, questionAnswers) : null;
    const samples = isTypeList ? this.getSample(dataType, questionAnswers) : null;
    const bins = isBinType ? this.getBin(dataType, questionAnswers) : null;

    const type = dataType !== DataType.Text ? dataType : questionType;
    return {
      type,
      buckets,
      samples,
      bins,
    };
  }

  getBucket(dataType: DataType, questionOptions: QuestionOption[], questionAnswers: QuestionAnswer[]): BucketNestedResponseDto[] {
    if (dataType === DataType.Rating) {
      return this.getRatingBucket(questionAnswers);
    }

    const options = questionOptions.map((questionOption) => ({
      ...questionOption,
      answers: questionAnswers.filter((questionAnswer) => questionAnswer.questionOptionId === questionOption.id),
    }));
    return options.map<BucketNestedResponseDto>((option) => ({
      value: option.label,
      count: option.answers.length,
    }));
  }

  getBin(dataType: DataType, questionAnswers: QuestionAnswer[]): BinNestedResponseDto[] | null {
    switch (dataType) {
      case DataType.Time: {
        // 24시간(0~23시)로 구간을 나누기
        const ranges = Array.from({ length: 24 }, (_, i) => ({
          x0: `${i.toString().padStart(2, '0')}:00`,
          x1: `${(i + 1).toString().padStart(2, '0')}:59`,
          count: 0,
        }));
        return questionAnswers.reduce<BinNestedResponseDto[]>((acc, questionAnswer) => {
          const value = questionAnswer.value!;
          const range = ranges.find((range) => value >= range.x0 && value < range.x1);
          if (range) {
            range.count++;
          }
          return acc;
        }, ranges);
      }
      default:
        return null;
    }
  }

  getTextSimilaritySample(questionAnswers: QuestionAnswer[]): SampleNestedResponseDto[] {
    return questionAnswers.reduce<SampleNestedResponseDto[]>((acc, questionAnswer) => {
      // 문자열 유사도(여기선 단순 부분일치가 아니라, 공통 접두사/편집거리 등 비교 가능)로 유사한 샘플 그룹핑
      // 여기서는 예시로 레벤슈타인 거리 기반 간단 유사도 80% 이상이면 동일 그룹으로 판단(간단 구현)
      // NOTICE: 레벤슈타인 + n-gram + 자카드 혼합 유사도 계산으로 교체
      const answerVal = questionAnswer.value ?? '';
      const existingSample = acc.find((sample) => {
        const similarity = this.processingService.hybridSimilarity(sample.snippet, answerVal);
        const threshold = this.processingService.pickThresholdByLen(
          this.processingService.normalizeKo(sample.snippet),
          this.processingService.normalizeKo(answerVal),
        );
        return similarity >= threshold;
      });
      if (existingSample) {
        existingSample.count++;
      } else {
        acc.push({
          snippet: questionAnswer.value ?? '',
          count: 1,
        });
      }
      return acc;
    }, [] as SampleNestedResponseDto[]);
  }

  getRatingBucket(questionAnswers: QuestionAnswer[]): BucketNestedResponseDto[] {
    const ranges = Array.from({ length: 5 }, (_, i) => ({
      value: (i + 1).toString(),
      count: 0,
    }));
    return questionAnswers.reduce<BucketNestedResponseDto[]>((acc, questionAnswer) => {
      const value = questionAnswer.value ?? 0;
      const existingBucket = acc.find((bucket) => bucket.value === value);
      if (existingBucket) {
        existingBucket.count++;
      }
      return acc;
    }, ranges as BucketNestedResponseDto[]);
  }

  getSample(dataType: DataType, questionAnswers: QuestionAnswer[]): SampleNestedResponseDto[] | null {
    switch (dataType) {
      case DataType.DateTime:
      case DataType.Date:
      case DataType.Text: {
        return this.getTextSimilaritySample(questionAnswers);
      }
      default:
        return null;
    }
  }

  async getQuestionDetails(surveyId: number, subscriptionId: number): Promise<QuestionDetailNestedResponseDto[]> {
    const questions = await this.orm
      .getRepo(Question)
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.survey', 's')
      .leftJoinAndSelect('q.questionOptions', 'qo')
      .leftJoinAndSelect('q.questionAnswers', 'qa')
      .where('q.surveyId = :surveyId', { surveyId })
      .andWhere('s.subscriptionId = :subscriptionId', { subscriptionId })
      .orderBy('q.id', 'ASC')
      .addOrderBy('q.sequence', 'ASC')
      .addOrderBy('qo.id', 'ASC') // option 정렬 추가
      .addOrderBy('qo.sequence', 'ASC') // option 정렬 추가
      .getMany();

    return questions.map((question) => {
      const distribution = this.getQuestionDistribution(question.questionType, question.dataType, question.questionOptions, question.questionAnswers);

      return {
        questionId: question.id,
        questionTitle: question.title,
        questionType: question.questionType,
        totalAnswers: question.questionAnswers.length,
        distribution,
        note: null,
      };
    });
  }
}
