import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { UserAccessStatusType } from '@share/enums/user-access-status-type';
import { User } from '@users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class UserAccess extends DefaultDateInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { comment: '유저 ID' })
  userId!: number;

  @Column('varchar', { length: 30, comment: '접속 상태' })
  status!: UserAccessStatusType;

  @Column('varchar', { length: 50, comment: '접속 IP' })
  accessIp!: string;

  @Column('varchar', { nullable: true, length: 50, comment: '접속 디바이스' })
  accessDevice!: string | null;

  @Column('varchar', { nullable: true, length: 50, comment: '접속 브라우저' })
  accessBrowser!: string | null;

  @Column('varchar', { nullable: true, length: 150, comment: '접속 유저 에이전트' })
  accessUserAgent!: string | null;

  @Column('datetime', { default: null, nullable: true, comment: '접속 시간' })
  lastAccessAt!: Date | null;

  @ManyToOne(() => User, (user) => user.userAccesses, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: Relation<User>;
}
