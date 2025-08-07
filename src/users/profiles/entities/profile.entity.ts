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
export class Profile extends DefaultDateInterface {
  @PrimaryGeneratedColumn({ comment: '프로필 PK' })
  id!: number;

  @Column('int', { unique: false, comment: '사용자 PK' })
  userId!: number;

  @Column('varchar', { length: 200, comment: '원본 파일 이름' })
  originalname!: string;

  @Column('varchar', { length: 100, comment: '파일 이름' })
  filename!: string;

  @Column('varchar', { length: 20, comment: '파일 타입' })
  mimetype!: string;

  @Column('double', { comment: '파일 사이즈' })
  size!: number;

  @Column('double', { comment: '이미지 너비' })
  width!: number;

  @Column('double', { comment: '이미지 높이' })
  height!: number;

  @Column('mediumblob', { comment: '파일 바이트' })
  buffer!: Buffer;

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
