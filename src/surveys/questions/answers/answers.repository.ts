import { Answer } from '@/surveys/entities/answer.entity';
import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { isNil } from '@util/isNil';
import { OrmHelper } from '@util/orm.helper';
import { FindOptionsWhere } from 'typeorm';
import { CreateAnswerPayloadDto } from './dto/payload/create-answer.payload.dto';
import { QuestionAnswer } from './entities/question-answer.entity';

@Injectable()
export class AnswersRepository extends BaseRepository {
  constructor(protected readonly orm: OrmHelper) {
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

  async createAnswer(createAnswerPayloadDto: CreateAnswerPayloadDto, surveyId: number, userId?: number) {
    const { answers } = createAnswerPayloadDto;

    const answerData = {
      surveyId,
      userId: userId ?? null,
    };

    const answerInsertResult = await this.orm.getRepo(Answer).insert(answerData);

    const answerId = answerInsertResult.identifiers[0].id;

    const questionAnswerDataList = answers.flatMap<Pick<QuestionAnswer, 'questionId' | 'questionOptionId' | 'value'>>((answer) =>
      !isNil(answer.optionIds)
        ? answer.optionIds.map((optionId) => ({
            answerId,
            questionId: answer.questionId,
            questionOptionId: optionId,
            value: null,
          }))
        : {
            answerId,
            questionId: answer.questionId,
            questionOptionId: null,
            value: answer.value,
          },
    );

    await this.orm.getRepo(QuestionAnswer).insert(questionAnswerDataList);
  }
}
