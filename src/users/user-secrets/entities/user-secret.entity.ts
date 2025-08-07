import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { User } from '@users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation
} from 'typeorm';

@Entity()
export class UserSecret extends DefaultDateInterface {
  @PrimaryGeneratedColumn({ comment: '사용자 비밀키 PK' })
  id!: number;

  @Column('int', { comment: '사용자 PK' })
  userId!: number;

  @Column('varchar', { length: 200, select: false, comment: '사용자 비밀번호' })
  password!: string;

  @Column('varchar', { length: 200, select: false, comment: '사용자 솔트' })
  salt!: string;

  @Column('int', { unsigned: true, select: false, comment: '반복 횟수' })
  iteration!: number;

  @OneToOne(() => User, (user) => user.userSecret, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: Relation<User>;
}
