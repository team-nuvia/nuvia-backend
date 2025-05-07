import { Sample, UserRole } from '@common/variable/enums';
import { fakerKO as faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { UserSecret } from '@user-secrets/entities/user-secret.entity';
import dayjs from 'dayjs';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ name: 'id', type: Number, example: 1 })
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  @ApiProperty({
    name: 'email',
    type: String,
    example: faker.internet.email({ provider: 'example.com' }),
  })
  email!: string;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({
    name: 'username',
    type: String,
    example: faker.person.fullName(),
  })
  username!: string;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({
    name: 'nickname',
    type: String,
    example: faker.helpers.mustache('{{first}}{{last}}', {
      first: faker.helpers.arrayElement(Sample.username.first),
      last: faker.helpers.arrayElement(Sample.username.last),
    }),
  })
  nickname!: string;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({
    name: 'role',
    enum: UserRole,
    type: () => UserRole,
    example: UserRole.User,
    description: `사용자 권한:<br>${Object.entries(UserRole)
      .map(([role, value]) => `${role}: ${value}`)
      .join('<br>')}`,
  })
  role!: UserRole;

  @CreateDateColumn({
    type: 'datetime',
    comment: '생성일시',
  })
  @ApiProperty({
    name: 'createdAt',
    type: Date,
    example: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'datetime',
    comment: '수정일시',
  })
  @ApiProperty({
    name: 'updatedAt',
    type: Date,
    example: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    type: 'datetime',
    nullable: true,
    comment: '삭제일시',
    select: false,
  })
  @ApiProperty({
    name: 'deletedAt',
    type: Date,
    example: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
    nullable: true,
  })
  deletedAt!: Date | null;

  @OneToOne(() => UserSecret, (userSecret) => userSecret.user, {
    cascade: true,
  })
  userSecret!: Relation<UserSecret>;
}
