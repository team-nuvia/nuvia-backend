import { UserRole } from '@share/enums/user-role';
import { IUser } from '@share/interface/iuser';
import { UserSecret } from '@user-secrets/entities/user-secret.entity';
import { Profile } from '@users/profiles/entities/profile.entity';
import { Type } from 'class-transformer';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from 'typeorm';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn({ comment: '사용자 PK' })
  id!: number;

  @Column('varchar', { length: 50, unique: true, comment: '이메일' })
  email!: string;

  @Column('varchar', { length: 50, unique: true })
  username!: string;

  @Column('varchar', { length: 50 })
  nickname!: string;

  @Column('varchar', { length: 50 })
  @Type(() => Number)
  role!: UserRole;

  @CreateDateColumn({ comment: '생성일시' })
  createdAt!: Date;

  @UpdateDateColumn({ comment: '수정일시' })
  updatedAt!: Date;

  @DeleteDateColumn({ select: false, nullable: true, comment: '삭제일시' })
  deletedAt!: Date | null;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile!: Relation<Profile>;

  @OneToOne(() => UserSecret, (userSecret) => userSecret.user, {
    cascade: true,
  })
  userSecret!: Relation<UserSecret>;
}
