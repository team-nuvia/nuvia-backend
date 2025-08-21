import { Subscription } from '@/subscriptions/entities/subscription.entity';
import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import { SurveyStatus } from '@share/enums/survey-status';
import { User } from '@users/entities/user.entity';
import { uniqueHash } from '@util/uniqueHash';
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Question } from '../questions/entities/question.entity';
import { Answer } from './answer.entity';
import { Category } from './category.entity';

@Index('category_id', ['categoryId'])
@Entity()
export class Survey extends DefaultDateInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { comment: '설문 조직 PK' })
  subscriptionId!: number;

  @Column('int', { comment: '유저 PK' })
  userId!: number;

  @Column('int', { comment: '설문 카테고리 PK' })
  categoryId!: number;

  @Column('varchar', { length: 64, comment: '설문 고유 키', unique: true })
  hashedUniqueKey!: string;

  @Column('varchar', { length: 50, comment: '설문 제목' })
  title!: string;

  @Column('varchar', { length: 300, nullable: true, comment: '설문 설명' })
  description!: string | null;

  @Column('tinyint', { comment: '공개 여부', default: true })
  isPublic!: boolean;

  @Column('varchar', { length: 50, comment: '설문 상태', default: SurveyStatus.Draft })
  status!: SurveyStatus;

  @Column('int', { comment: '조회 수', default: 0 })
  viewCount!: number;

  @Column('datetime', { nullable: true, comment: '만료일시', default: null })
  expiresAt!: Date | null;

  @OneToMany(() => Question, (question) => question.survey, {
    cascade: true,
  })
  questions!: Relation<Question>[];

  @OneToMany(() => Answer, (answer) => answer.survey, {
    cascade: true,
  })
  answers!: Relation<Answer>[];

  @ManyToOne(() => Subscription, (subscription) => subscription.surveys, { onDelete: 'NO ACTION' })
  subscription!: Relation<Subscription>;

  @ManyToOne(() => User, (user) => user.surveys, {
    onDelete: 'NO ACTION',
  })
  user!: Relation<User>;

  @ManyToOne(() => Category, (category) => category.surveys, { onDelete: 'NO ACTION', createForeignKeyConstraints: false })
  @JoinColumn()
  category!: Relation<Category>;

  get respondentCount(): number {
    return this.answers.length;
  }

  get realtimeStatus(): SurveyStatus {
    console.log('🚀 ~ Survey ~ this.expiresAt:', this.expiresAt);
    console.log('🚀 ~ Survey ~ this.status:', this.status);
    return this.expiresAt && this.expiresAt < new Date() ? SurveyStatus.Closed : this.status;
  }

  /**
   * 예상 소요시간 계산
   * @returns 예상 소요시간 (분, 소수점 1자리까지)
   */
  get estimatedTime() {
    // 질문 유형별 예상 소요시간 (초 단위)
    const QUESTION_TIME_MAP = {
      [QuestionType.SingleChoice]: 5, // 단일 선택: 5초
      [QuestionType.MultipleChoice]: 8, // 다중 선택: 8초
      [QuestionType.ShortText]: 15, // 텍스트 입력: 15초
      [QuestionType.LongText]: 30, // 긴 텍스트 입력: 30초
    };

    const DATA_TIME_MAP: Partial<Record<DataType, number>> = {
      [DataType.Text]: 5, // 텍스트 입력: 5초
      [DataType.Date]: 8, // 날짜 선택: 8초
      [DataType.Email]: 10, // 이메일 입력: 10초
      [DataType.DateTime]: 8, // 날짜시간 입력: 8초
      [DataType.Link]: 12, // URL 입력: 12초
      [DataType.Rating]: 6, // 평점: 6초
    };

    /* 예상시간 (초) */
    const estimatedTime = this.questions.reduce((acc, question) => {
      const baseTime = QUESTION_TIME_MAP[question.questionType] ?? DATA_TIME_MAP[question.dataType] ?? 10; // 기본값 10초

      // 선택지가 많은 경우 추가 시간 계산
      let additionalTime = 0;
      if (question.questionOptions && question.questionOptions.length > 4) {
        additionalTime = Math.floor((question.questionOptions.length - 4) * 0.5);
      }

      return acc + baseTime + additionalTime;
    }, 0);

    /* second to minute and round up */
    return Number((estimatedTime / 60).toFixed(1));
  }

  @BeforeInsert()
  async beforeInsert() {
    this.hashedUniqueKey = uniqueHash();
  }
}
