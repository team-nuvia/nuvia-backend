import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { BoolTinyIntTransformer } from '@common/transformer/bool.transformer';
import { SocialProvider } from '@share/enums/social-provider.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserProvider extends DefaultDateInterface {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { comment: '사용자 PK' })
  userId!: number;

  @Column('varchar', { nullable: true, default: null, length: 100, comment: 'ID Token' })
  providerId!: string | null;

  @Column('varchar', { length: 150, comment: '공급자' })
  provider!: SocialProvider;

  @Column('varchar', { length: 50, comment: '이름' })
  name!: string;

  @Column('varchar', { length: 50, comment: '닉네임 (코드레벨에서 unique 검증)' })
  nickname!: string;

  @Column('varchar', { length: 100, comment: '이메일 (코드레벨에서 unique 검증)' })
  email!: string;

  @Column('varchar', { nullable: true, length: 255, comment: '이미지' })
  image!: string;

  @Column('tinyint', { default: false, transformer: BoolTinyIntTransformer, comment: '메일링 여부' })
  mailing!: boolean;

  @ManyToOne(() => User, (user) => user.userProviders, { onDelete: 'CASCADE' })
  user!: Relation<User>;
}
