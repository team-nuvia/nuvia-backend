import { Sample, UserRole } from '@common/variable/enums';
import { fakerKO as faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { UserSecret } from '@user-secrets/entities/user-secret.entity';
import { Profile } from '@users/profiles/entities/profile.entity';
import dayjs from 'dayjs';
import { IUser } from '@share/interface/iuser';
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
export class User implements IUser {
  @ApiProperty({ name: 'id', type: Number, example: 1 })
  @PrimaryGeneratedColumn({ comment: '사용자 PK' })
  id!: number;

  @ApiProperty({
    type: String,
    example: faker.internet.email({ provider: 'example.com' }),
  })
  @Column('varchar', { length: 50, unique: true, comment: '이메일' })
  email!: string;

  @ApiProperty({
    type: String,
    example: faker.person.fullName(),
  })
  @Column('varchar', { length: 50 })
  username!: string;

  @ApiProperty({
    type: String,
    example: faker.helpers.mustache('{{first}}{{last}}', {
      first: faker.helpers.arrayElement(Sample.username.first),
      last: faker.helpers.arrayElement(Sample.username.last),
    }),
  })
  @Column('varchar', { length: 50 })
  nickname!: string;

  @ApiProperty({
    enum: UserRole,
    type: () => UserRole,
    example: UserRole.User,
    description: `사용자 권한:<br>${Object.entries(UserRole)
      .map(([role, value]) => `${role}: ${value}`)
      .join('<br>')}`,
  })
  @Column('varchar', { length: 50 })
  role!: UserRole;

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

  @OneToOne(() => Profile, (profile) => profile.user)
  profile!: Relation<Profile>;

  @OneToOne(() => UserSecret, (userSecret) => userSecret.user, {
    cascade: true,
  })
  userSecret!: Relation<UserSecret>;
}
