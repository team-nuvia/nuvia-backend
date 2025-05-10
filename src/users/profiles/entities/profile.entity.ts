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
export class Profile {
  @ApiProperty({ type: Number, description: '프로필 PK', example: 1 })
  @PrimaryGeneratedColumn({ comment: '프로필 PK' })
  id!: number;

  @ApiProperty({ type: Number, description: '사용자 PK', example: 1 })
  @Column('int', { unique: false, comment: '사용자 PK' })
  userId!: number;

  @ApiProperty({ type: String, description: '원본 파일 이름', example: '1' })
  @Column('varchar', { length: 200, comment: '원본 파일 이름' })
  originalname!: string;

  @ApiProperty({ type: String, description: '파일 이름', example: '1' })
  @Column('varchar', { length: 200, comment: '파일 이름' })
  filename!: string;

  @ApiProperty({ type: String, description: '파일 타입', example: '1' })
  @Column('varchar', { length: 20, comment: '파일 타입' })
  mimetype!: string;

  @ApiProperty({ type: String, description: '파일 사이즈', example: '1' })
  @Column('int', { comment: '파일 사이즈' })
  size!: number;

  @ApiProperty({ type: Number, description: '이미지 너비', example: 1024 })
  @Column('int', { comment: '이미지 너비' })
  width!: number;

  @ApiProperty({ type: Number, description: '이미지 높이', example: 768 })
  @Column('int', { comment: '이미지 높이' })
  height!: number;

  @ApiProperty({ type: String, description: '파일 바이트', example: '1' })
  @Column('mediumblob', { comment: '파일 바이트' })
  buffer!: Buffer;

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

  @OneToOne(() => User, (user) => user.profile, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: Relation<User>;
}
