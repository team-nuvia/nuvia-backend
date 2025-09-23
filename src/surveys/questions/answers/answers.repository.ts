import { Answer } from '@/surveys/entities/answer.entity';
import { BaseRepository } from '@common/base.repository';
import { VERIFY_JWS_EXPIRE_TIME } from '@common/variable/globals';
import { Injectable } from '@nestjs/common';
import { AnswerStatus } from '@share/enums/answer-status';
import { QuestionType } from '@share/enums/question-type';
import { isNil } from '@util/isNil';
import { OrmHelper } from '@util/orm.helper';
import { UtilService } from '@util/util.service';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { FindOptionsWhere } from 'typeorm';
import { ExpiredAnswerExceptionDto } from './dto/exception/expired-answer.exception.dto';
import { ExpiredJwsExceptionDto } from './dto/exception/expired-jws.exception.dto';
import { NoVerifyAccessTokenExceptionDto } from './dto/exception/no-verify-access-token.jws.dto';
import { NotFoundAnswerExceptionDto } from './dto/exception/not-found-answer.exception.dto';
import { RequiredRefreshJwsExceptionDto } from './dto/exception/required-refresh-jws.exception.dto';
import { CreateAnswerPayloadDto } from './dto/payload/create-answer.payload.dto';
import { StartAnswerPayloadDto } from './dto/payload/start-answer.payload.dto';
import { StartAnswerNestedResponseDto } from './dto/response/start-answer.nested.response.dto';
import { ValidateFirstSurveyAnswerNestedResponseDto } from './dto/response/validate-first-survey-answer.nested.response.dto';
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

    const answerData = {
      surveyId,
      userId: userId ?? null,
      status: AnswerStatus.Started,
      userAgent: startAnswerPayloadDto.userAgent,
      submissionHash,
      expiredAt: new Date(Date.now() + VERIFY_JWS_EXPIRE_TIME),
    };

    const answerInsertResult = await this.orm.getRepo(Answer).insert(answerData);

    // 설문 인증 JWS 토큰 (데이터 최소화)
    const jwsToken = this.utilService.createSurveyJWS({
      answerId: answerInsertResult.identifiers[0].id,
      surveyId,
    });

    return { jwsToken, submissionHash };
  }

  async refreshAnswer(surveyId: number, submissionHash: string, res: Response) {
    const answer = await this.orm
      .getRepo(Answer)
      .createQueryBuilder('answer')
      .where('answer.surveyId = :surveyId', { surveyId })
      .andWhere('answer.submissionHash = :submissionHash', { submissionHash })
      .andWhere('answer.status IN (:...status)', { status: [AnswerStatus.Started, AnswerStatus.InProgress, AnswerStatus.Saved] })
      .andWhere('answer.expiredAt > :expiredAt', { expiredAt: new Date() })
      .getOne();

    if (!answer) {
      throw new NotFoundAnswerExceptionDto();
    }

    await this.orm.getRepo(Answer).update({ id: answer.id }, { expiredAt: new Date(Date.now() + VERIFY_JWS_EXPIRE_TIME) });

    /* 인증 토큰 갱신 */
    const jwsToken = this.utilService.createSurveyJWS({
      answerId: answer.id,
      surveyId,
    });
    res.cookie('X-Client-Jws', jwsToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      expires: new Date(Date.now() + VERIFY_JWS_EXPIRE_TIME),
    });

    return { submissionHash };
  }

  async expiredAnswer(submissionHash: string, res: Response) {
    await this.orm.getRepo(Answer).update({ submissionHash }, { status: AnswerStatus.Aborted });

    /* 만료된 쿠키 제거 */
    res.clearCookie('X-Client-Jws', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    res.clearCookie('X-Client-Hash', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    throw new ExpiredAnswerExceptionDto();
  }

  async validateFirstSurveyAnswer(
    submissionHash: string,
    jws: string,
    surveyId: number,
    res: Response,
  ): Promise<ValidateFirstSurveyAnswerNestedResponseDto> {
    // const result = { isFirst: true };
    const combineFlag = {
      submissionHash: true,
      jws: true,
    };
    let answer: Answer | null = null;

    /* 만료 검사 */
    if (submissionHash) {
      // 2. 시작/진행중인 답변 불러오기
      answer = await this.orm.getRepo(Answer).findOne({
        select: ['id', 'status', 'expiredAt', 'deletedAt'],
        where: { surveyId, submissionHash },
      });

      if (answer) {
        if (answer.status === AnswerStatus.Completed) {
          return { isFirst: true };
        }

        /* 응답 세션 만료 */
        if (answer.status === AnswerStatus.Aborted || answer.expiredAt < new Date()) {
          /* exception 1개 */
          await this.expiredAnswer(submissionHash, res);
        }

        /* 3. 진행중 처리 */
        if (answer.status === AnswerStatus.Started) {
          await this.orm.getRepo(Answer).update({ id: answer.id }, { status: AnswerStatus.InProgress });
        }

        combineFlag.submissionHash = false;
      } else {
        /* 응답 세션 없음 */
        throw new NotFoundAnswerExceptionDto();
      }
    }

    /* 인증 토큰 검사 */
    if (jws) {
      // 4. 설문 서명 토큰 검증 (exception 2개)
      try {
        this.utilService.verifySurveyJWS(jws);
        combineFlag.jws = false;
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          /* 인증 토큰 만료 */
          /* 클라에서 갱신 요청 하도록 해야함 */
          throw new ExpiredJwsExceptionDto();
        }

        /* 만료된 쿠키 제거 */
        res.clearCookie('X-Client-Jws', {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          path: '/',
        });
        res.clearCookie('X-Client-Hash', {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          path: '/',
        });
        throw new NoVerifyAccessTokenExceptionDto();
      }
    } else {
      if (!combineFlag.submissionHash) {
        /* 인증 토큰 없음 - 클라에서 갱신 요청 하도록 해야함 */
        throw new RequiredRefreshJwsExceptionDto();
      }
      /* 응답 세션이 없으면 완전 처음 */
    }

    const isFirst = combineFlag.submissionHash && combineFlag.jws;
    return { isFirst };
  }

  async createAnswer(createAnswerPayloadDto: CreateAnswerPayloadDto, surveyId: number, submissionHash: string, res: Response, userId?: number) {
    const { answers, status } = createAnswerPayloadDto;
    const answerEntity = await this.orm
      .getRepo(Answer)
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.questionAnswers', 'qa')
      .leftJoinAndSelect('qa.question', 'q')
      .where('a.surveyId = :surveyId', { surveyId })
      .andWhere('a.submissionHash = :submissionHash', { submissionHash })
      .andWhere('a.status IN (:...status)', { status: [AnswerStatus.Started, AnswerStatus.InProgress, AnswerStatus.Saved] })
      .getOne();

    if (!answerEntity) {
      throw new NotFoundAnswerExceptionDto();
    }

    if (answerEntity.userId !== (userId ?? null)) {
      throw new NotFoundAnswerExceptionDto('잘못된 요청입니다.');
    }

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

    const insertPromises = [];
    const deletePromises = [];
    const updatePromises = [];

    const updateTextOptions = answerEntity.questionAnswers.filter((db) =>
      questionAnswerDataList.some(
        (payload) =>
          payload.questionId === db.questionId &&
          (db.question.questionType === QuestionType.ShortText || db.question.questionType === QuestionType.LongText) &&
          payload.value !== db.value,
      ),
    );

    const updateSingleChoiceOptions = answerEntity.questionAnswers.filter((db) =>
      questionAnswerDataList.some(
        (payload) =>
          payload.questionId === db.questionId &&
          db.question.questionType === QuestionType.SingleChoice &&
          payload.questionOptionId !== db.questionOptionId,
      ),
    );

    const updateConcatOptions = updateTextOptions.concat(updateSingleChoiceOptions);

    const updateQuestionIds = updateConcatOptions.map((update) => update.questionId);

    const dbAnswerWithoutUpdates = answerEntity.questionAnswers.filter((db) => !updateQuestionIds.includes(db.questionId));

    const payloadWithoutUpdates = questionAnswerDataList.filter((payload) => !updateQuestionIds.includes(payload.questionId));

    for (const dbAnswer of updateConcatOptions) {
      if (dbAnswer.question.questionType === QuestionType.SingleChoice) {
        const payloadAnswer = questionAnswerDataList.find((payload) => payload.questionId === dbAnswer.questionId);
        if (dbAnswer.questionOptionId && payloadAnswer?.questionOptionId !== dbAnswer.questionOptionId) {
          updatePromises.push(
            this.orm.getRepo(QuestionAnswer).update({ id: dbAnswer.id }, { questionOptionId: payloadAnswer?.questionOptionId, value: null }),
          );
        }
      } else if (dbAnswer.question.questionType !== QuestionType.MultipleChoice) {
        const payloadAnswer = questionAnswerDataList.find(
          (payload) => payload.questionId === dbAnswer.questionId && payload.questionOptionId === dbAnswer.questionOptionId,
        );
        if (dbAnswer.value && payloadAnswer?.value !== dbAnswer.value) {
          updatePromises.push(this.orm.getRepo(QuestionAnswer).update({ id: dbAnswer.id }, { value: payloadAnswer?.value }));
        }
      }
    }

    /* TODO: insert, update에서 singleChoice제거 */
    /* TODO: update에서 singleChoice 포함해서 update 로직 변경해야함 */
    const insertOptions = payloadWithoutUpdates.filter(
      (payload) =>
        !answerEntity.questionAnswers.some((db) => db.questionId === payload.questionId && db.questionOptionId === payload.questionOptionId),
    );
    if (insertOptions.length > 0) {
      insertPromises.push(
        insertOptions.map((payload) =>
          this.orm
            .getRepo(QuestionAnswer)
            .insert({ questionId: payload.questionId, answerId: answerEntity.id, questionOptionId: payload.questionOptionId, value: payload.value }),
        ),
      );
    }

    const deleteOptions = dbAnswerWithoutUpdates.filter(
      (db) => !questionAnswerDataList.some((payload) => payload.questionId === db.questionId && payload.questionOptionId === db.questionOptionId),
    );
    if (deleteOptions.length > 0) {
      deletePromises.push(this.orm.getRepo(QuestionAnswer).softDelete(deleteOptions.map((db) => db.id)));
    }

    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
    }

    if (status === AnswerStatus.Saved) {
      await this.orm
        .getRepo(Answer)
        .update({ id: answerEntity.id }, { status: AnswerStatus.Saved, expiredAt: new Date(Date.now() + VERIFY_JWS_EXPIRE_TIME) });
    } else if (status === AnswerStatus.Completed) {
      await this.orm.getRepo(Answer).update({ id: answerEntity.id }, { status: AnswerStatus.Completed, completedAt: new Date() });

      res.clearCookie('X-Client-Jws', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      });
      res.clearCookie('X-Client-Hash', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      });
    }
  }
}
