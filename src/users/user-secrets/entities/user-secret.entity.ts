import { ApiProperty } from '@nestjs/swagger';
import { User } from '@users/entities/user.entity';
import dayjs from 'dayjs';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserSecret {
  @ApiProperty({ type: Number, example: 1, description: '사용자 비밀키 PK' })
  @PrimaryGeneratedColumn({ comment: '사용자 비밀키 PK' })
  id!: number;

  @ApiProperty({ type: Number, example: 1, description: '사용자 PK' })
  @Column('int', { comment: '사용자 PK' })
  userId!: number;

  @ApiProperty({
    type: String,
    example: 'password123',
    description: '사용자 비밀번호',
    nullable: true,
  })
  @Column('varchar', { length: 200, select: false, comment: '사용자 비밀번호' })
  password!: string;

  @ApiProperty({
    type: String,
    example: 'salt123',
    description: '사용자 솔트',
    nullable: true,
  })
  @Column('varchar', { length: 200, select: false, comment: '사용자 솔트' })
  salt!: string;

  @ApiProperty({
    type: Number,
    example: 1000,
    description: '반복 횟수',
    nullable: true,
  })
  @Column('int', { unsigned: true, select: false, comment: '반복 횟수' })
  iteration!: number;

  @ApiProperty({
    type: Date,
    description: '생성일시',
    example: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
  })
  @CreateDateColumn({
    comment: '생성일시',
  })
  createdAt!: Date;

  @ApiProperty({
    type: Date,
    description: '수정일시',
    example: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
  })
  @UpdateDateColumn({
    comment: '수정일시',
  })
  updatedAt!: Date;

  @ApiProperty({
    type: Date,
    description: '삭제일시',
    example: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
    nullable: true,
  })
  @DeleteDateColumn({
    select: false,
    nullable: true,
    comment: '삭제일시',
  })
  deletedAt!: Date | null;

  @OneToOne(() => User, (user) => user.userSecret, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: Relation<User>;
}
