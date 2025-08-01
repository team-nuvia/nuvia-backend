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
  @ApiProperty({ description: '프로필 PK', example: 1 })
  @PrimaryGeneratedColumn({ comment: '프로필 PK' })
  id!: number;

  @ApiProperty({ description: '사용자 PK', example: 1 })
  @Column('int', { unique: false, comment: '사용자 PK' })
  userId!: number;

  @ApiProperty({ description: '원본 파일 이름', example: '1' })
  @Column('varchar', { length: 200, comment: '원본 파일 이름' })
  originalname!: string;

  @ApiProperty({ description: '파일 이름', example: '1' })
  @Column('varchar', { length: 200, comment: '파일 이름' })
  filename!: string;

  @ApiProperty({ description: '파일 타입', example: '1' })
  @Column('varchar', { length: 20, comment: '파일 타입' })
  mimetype!: string;

  @ApiProperty({ description: '파일 사이즈', example: '1' })
  @Column('int', { comment: '파일 사이즈' })
  size!: number;

  @ApiProperty({ description: '이미지 너비', example: 1024 })
  @Column('int', { comment: '이미지 너비' })
  width!: number;

  @ApiProperty({ description: '이미지 높이', example: 768 })
  @Column('int', { comment: '이미지 높이' })
  height!: number;

  @ApiProperty({ description: '파일 바이트', example: '1' })
  @Column('mediumblob', { comment: '파일 바이트' })
  buffer!: Buffer;

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

  @OneToOne(() => User, (user) => user.profile, {
    // cascade 속성을 true로 설정하여, 연관된 엔티티의 변경이 이 엔티티에 반영되도록 합니다.
    // onDelete 속성을 'CASCADE'로 설정하여, 이 엔티티와 연관된 엔티티가 삭제되면 이 엔티티도 함께 삭제되도록 합니다.
    // 그러나, onDelete: 'CASCADE'가 설정되면 cascade: true는 중복되는 속성이 됩니다.
    // 따라서, onDelete: 'CASCADE'만 설정하면 충분합니다.
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: Relation<User>;
}
