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
  @ApiProperty({ example: 1, description: '사용자 비밀키 PK' })
  @PrimaryGeneratedColumn({ comment: '사용자 비밀키 PK' })
  id!: number;

  @ApiProperty({ example: 1, description: '사용자 PK' })
  @Column('int', { comment: '사용자 PK' })
  userId!: number;

  @ApiProperty({ example: 'password123', description: '사용자 비밀번호', nullable: true })
  @Column('varchar', { length: 200, select: false, comment: '사용자 비밀번호' })
  password!: string;

  @ApiProperty({ example: 'salt123', description: '사용자 솔트', nullable: true })
  @Column('varchar', { length: 200, select: false, comment: '사용자 솔트' })
  salt!: string;

  @ApiProperty({ example: 1000, description: '반복 횟수', nullable: true })
  @Column('int', { unsigned: true, select: false, comment: '반복 횟수' })
  iteration!: number;

  @ApiProperty({
    description: '생성일시',
    example: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
  })
  @CreateDateColumn({ comment: '생성일시' })
  createdAt!: Date;

  @ApiProperty({
    description: '수정일시',
    example: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
  })
  @UpdateDateColumn({ comment: '수정일시' })
  updatedAt!: Date;

  @ApiProperty({
    description: '삭제일시',
    example: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
    nullable: true,
  })
  @DeleteDateColumn({ select: false, nullable: true, comment: '삭제일시' })
  deletedAt!: Date | null;

  @OneToOne(() => User, (user) => user.userSecret, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: Relation<User>;
}
