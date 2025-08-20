import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { AnswerStatus } from '@share/enums/answer-status';
import { User } from '@users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { QuestionAnswer } from '../questions/answers/entities/question-answer.entity';
import { Survey } from './survey.entity';

@Entity()
export class Answer extends DefaultDateInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { comment: '설문 PK' })
  surveyId!: number;

  /* 응답자 정보 - 비회원은 null */
  @Column('int', { nullable: true, comment: '유저(응답자) PK' })
  userId!: number | null;

  /* 응답자 쿠키, 링크 토큰 - 회원은 null */
  @Column('varchar', { length: 255, nullable: true, comment: '비회원 해시' })
  submissionHash!: string | null;

  /* 응답자 디바이스 정보 - 응답자 전부 저장 */
  @Column('varchar', { length: 255, nullable: true, comment: '유저 에이전트' })
  userAgent!: string | null;

  @Column('varchar', { default: AnswerStatus.Started, length: 50, comment: '설문 상태' })
  status!: AnswerStatus;

  /* 실제 만료 일시 - 쿠키 만료 시간 초과 시 설정 */
  @Column('datetime', { comment: '실제 만료 일시' })
  expiredAt!: Date;

  @Column('datetime', { default: null, nullable: true, comment: '완료 일시' })
  completedAt!: Date | null;

  @OneToMany(() => QuestionAnswer, (questionAnswer) => questionAnswer.answer, { cascade: true })
  questionAnswers!: Relation<QuestionAnswer>[];

  @ManyToOne(() => User, (user) => user.answers, { onDelete: 'NO ACTION' })
  user!: Relation<User>;

  @ManyToOne(() => Survey, (survey) => survey.answers, { onDelete: 'NO ACTION' })
  survey!: Relation<Survey>;
}
