import { Answer } from '@/surveys/entities/answer.entity';
import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { AnswerStatus } from '@share/enums/answer-status';
import { isNil } from '@util/isNil';
import { OrmHelper } from '@util/orm.helper';
import { UtilService } from '@util/util.service';
import { nanoid } from 'nanoid';
import { FindOptionsWhere, In, Not } from 'typeorm';
import { NoValidateFirstSurveyAnswerExceptionDto } from './dto/exception/no-validate-first-survey-answer.exception.dto';
import { NotFoundAnswerExceptionDto } from './dto/exception/not-found-answer.exception.dto';
import { CreateAnswerPayloadDto } from './dto/payload/create-answer.payload.dto';
import { StartAnswerPayloadDto } from './dto/payload/start-answer.payload.dto';
import { StartAnswerNestedResponseDto } from './dto/response/start-answer.nested.response.dto';
import { QuestionAnswer } from './entities/question-answer.entity';

@Injectable()
export class AnswersRepository extends BaseRepository {
  constructor(
    protected readonly orm: OrmHelper,
    private readonly utilService: UtilService,
  ) {
    super(orm);
  }

  async softDelete(id: number): Promise<void> {
    await this.orm.getRepo(QuestionAnswer).softDelete(id);
  }

  existsByWithDeleted(condition: FindOptionsWhere<QuestionAnswer>): Promise<boolean> {
    return this.orm.getRepo(QuestionAnswer).exists({ where: condition, withDeleted: true });
  }

  existsBy(condition: FindOptionsWhere<QuestionAnswer>): Promise<boolean> {
    return this.orm.getRepo(QuestionAnswer).exists({ where: condition });
  }

  async startAnswer(surveyId: number, startAnswerPayloadDto: StartAnswerPayloadDto, userId?: number): Promise<StartAnswerNestedResponseDto> {
    const randomUUID = nanoid(32);
    const hashKey = 'nuvia';
    const hashRound = Date.now();

    // 해시 데이터는 노출하지 않는다.
    const submissionHash = this.utilService.createHash(`${randomUUID}:${hashKey}:${hashRound}`);

    const answerData: Pick<Answer, 'surveyId' | 'userId' | 'status' | 'userAgent' | 'submissionHash'> = {
      surveyId,
      userId: userId ?? null,
      status: AnswerStatus.Started,
      userAgent: startAnswerPayloadDto.userAgent,
      submissionHash,
    };

    const answerInsertResult = await this.orm.getRepo(Answer).insert(answerData);

    // 설문 인증 JWS 토큰 (데이터 최소화)
    const jwsToken = this.utilService.createSurveyJWS({
      answerId: answerInsertResult.identifiers[0].id,
      surveyId,
    });

    return { jwsToken, submissionHash };
  }

  async validateFirstSurveyAnswer(submissionHash: string, jws: string, surveyId: number): Promise<void> {
    // 1. 토큰 존재 여부 확인
    if (!submissionHash || !jws) {
      throw new NoValidateFirstSurveyAnswerExceptionDto();
    }

    // 2. 설문 서명 토큰 검증
    const decodeResult = this.utilService.verifySurveyJWS(jws);

    if (!decodeResult) {
      throw new NoValidateFirstSurveyAnswerExceptionDto('잘못된 요청입니다.');
    }

    // 3. 시작/진행중인 답변 불러오기
    const answer = await this.orm
      .getRepo(Answer)
      .findOne({ where: { surveyId, submissionHash, status: In([AnswerStatus.Started, AnswerStatus.InProgress]) } });

    if (!answer) {
      throw new NoValidateFirstSurveyAnswerExceptionDto('잘못된 요청입니다.');
    }

    /* 4. 진행중 처리 */
    await this.orm.getRepo(Answer).update({ id: answer.id, status: Not(AnswerStatus.InProgress) }, { status: AnswerStatus.InProgress });
  }

  async createAnswer(createAnswerPayloadDto: CreateAnswerPayloadDto, surveyId: number, submissionHash: string, userId?: number) {
    const { answers } = createAnswerPayloadDto;

    const answerEntity = await this.orm.getRepo(Answer).findOne({ where: { surveyId, submissionHash, status: AnswerStatus.InProgress } });

    if (!answerEntity) {
      throw new NotFoundAnswerExceptionDto();
    }

    if (answerEntity.userId !== userId) {
      throw new NotFoundAnswerExceptionDto('잘못된 요청입니다.');
    }

    await this.orm.getRepo(Answer).update({ id: answerEntity.id }, { status: AnswerStatus.Completed, completedAt: new Date() });

    const questionAnswerDataList = answers.flatMap<Pick<QuestionAnswer, 'questionId' | 'questionOptionId' | 'value'>>((answer) =>
      !isNil(answer.optionIds)
        ? answer.optionIds.map((optionId) => ({
            answerId: answerEntity.id,
            questionId: answer.questionId,
            questionOptionId: optionId,
            value: null,
          }))
        : {
            answerId: answerEntity.id,
            questionId: answer.questionId,
            questionOptionId: null,
            value: answer.value,
          },
    );

    await this.orm.getRepo(QuestionAnswer).insert(questionAnswerDataList);
  }
}
