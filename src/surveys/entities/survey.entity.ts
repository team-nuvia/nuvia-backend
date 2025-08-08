import { SurveyStatus } from '@share/enums/survey-status';
import { User } from '@users/entities/user.entity';
import { uniqueHash } from '@util/uniqueHash';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from '../questions/entities/question.entity';

@Entity()
export class Survey {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { comment: '유저 PK' })
  userId!: number;

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

  @Column('datetime', { nullable: true, comment: '만료일시', default: null })
  expiresAt!: Date | null;

  @CreateDateColumn({ type: 'datetime', comment: '생성일시' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '수정일시' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'datetime', select: false, nullable: true, comment: '삭제일시' })
  deletedAt!: Date | null;

  @OneToMany(() => Question, (question) => question.survey, {
    cascade: true,
  })
  questions!: Relation<Question>[];

  @ManyToOne(() => User, (user) => user.surveys, {
    onDelete: 'NO ACTION',
  })
  user!: Relation<User>;

  get respondentCount(): number {
    const uniqueRespondentCount = new Set(this.questions.map((question) => question.questionAnswers.map((questionAnswer) => questionAnswer.userId)));
    return uniqueRespondentCount.size;
  }

  @BeforeInsert()
  async beforeInsert() {
    this.hashedUniqueKey = uniqueHash();
  }
}
