import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { QuestionAnswer } from './question-answer.entity';

@Entity()
export class ReferenceBuffer extends DefaultDateInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { comment: '질문 답변 PK' })
  questionAnswerId!: number;

  @Column('varchar', { length: 255, comment: '원본 파일 이름' })
  originalname!: string;

  @Column('varchar', { length: 100, comment: '파일 이름' })
  filename!: string;

  @Column('varchar', { length: 20, comment: '파일 타입' })
  mimetype!: string;

  @Column('double', { comment: '파일 사이즈' })
  size!: number;

  @Column('mediumblob', { comment: '파일 바이트' })
  buffer!: Buffer;

  @OneToOne(() => QuestionAnswer, (questionAnswer) => questionAnswer.referenceBuffer, { onDelete: 'CASCADE' })
  @JoinColumn()
  questionAnswer!: Relation<QuestionAnswer>;
}
