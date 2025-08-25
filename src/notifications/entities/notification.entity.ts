import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { NotificationType } from '@share/enums/notification-type';
import { User } from '@users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Index('idx_reference_id', ['referenceId'])
@Index('idx_type', ['type'])
@Entity()
export class Notification extends DefaultDateInterface {
  @PrimaryGeneratedColumn({ comment: '알림 고유 번호' })
  id!: number;

  @Column('int', { comment: '알림 발신자' })
  fromId!: number;

  @Column('int', { comment: '알림 수신자' })
  toId!: number;

  @Column('int', { nullable: true, default: null, comment: '참조 아이디' })
  referenceId!: number | null;

  @Column('varchar', { nullable: true, default: null, length: 50, comment: '알림 타입' })
  type!: NotificationType | null;

  @Column('varchar', { length: 100, comment: '제목' })
  title!: string;

  @Column('varchar', { nullable: true, default: null, length: 300, comment: '내용' })
  content!: string | null;

  @Column('tinyint', { default: false, comment: '읽음 여부' })
  isRead!: boolean;

  @Column('datetime', { nullable: true, default: null, comment: '읽은 시간' })
  readAt!: Date | null;

  @ManyToOne(() => User, (user) => user.notificationsFrom, {
    onDelete: 'CASCADE',
  })
  from!: Relation<User>;

  @ManyToOne(() => User, (user) => user.notificationsTo, {
    onDelete: 'CASCADE',
  })
  to!: Relation<User>;
}
