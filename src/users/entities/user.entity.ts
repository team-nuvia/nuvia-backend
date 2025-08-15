import { Payment } from '@/payments/entities/payment.entity';
import { LogUsageSubscription } from '@/subscriptions/entities/log-usage-subscription.entity';
import { Subscription } from '@/subscriptions/entities/subscription.entity';
import { OrganizationRole } from '@/subscriptions/organization-roles/entities/organization-role.entity';
import { Survey } from '@/surveys/entities/survey.entity';
import { QuestionAnswer } from '@/surveys/questions/answers/entities/question-answer.entity';
import { CommonService } from '@common/common.service';
import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { UserSecret } from '@user-secrets/entities/user-secret.entity';
import { Profile } from '@users/profiles/entities/profile.entity';
import { UserAccess } from '@users/user-accesses/entities/user-access.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class User extends DefaultDateInterface {
  @PrimaryGeneratedColumn({ comment: '사용자 PK' })
  id!: number;

  @Column('varchar', { length: 50, comment: '이름' })
  name!: string;

  @Column('varchar', { length: 50, comment: '이메일 (코드레벨에서 unique 검증)' })
  email!: string;

  @Column('varchar', { length: 50, comment: '닉네임 (코드레벨에서 unique 검증)' })
  nickname!: string;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  profile!: Relation<Profile>;

  @OneToOne(() => UserSecret, (userSecret) => userSecret.user, {
    cascade: true,
  })
  userSecret!: Relation<UserSecret>;

  @OneToMany(() => Survey, (survey) => survey.user, {
    cascade: true,
  })
  surveys!: Relation<Survey>[];

  @OneToMany(() => QuestionAnswer, (questionAnswer) => questionAnswer.user, {
    cascade: true,
  })
  questionAnswers!: Relation<QuestionAnswer>[];

  @OneToMany(() => OrganizationRole, (organizationRole) => organizationRole.user, {
    cascade: true,
  })
  organizationRoles!: Relation<OrganizationRole>[];

  @OneToMany(() => Payment, (payment) => payment.user, {
    cascade: true,
  })
  payments!: Relation<Payment>[];

  @OneToMany(() => UserAccess, (userAccess) => userAccess.user, {
    cascade: true,
  })
  userAccesses!: Relation<UserAccess>[];

  @OneToOne(() => Subscription, (subscription) => subscription.user, {
    cascade: true,
  })
  subscription!: Relation<Subscription>;

  @OneToMany(() => LogUsageSubscription, (logUsageSubscription) => logUsageSubscription.user, {
    cascade: true,
  })
  logUsageSubscriptions!: Relation<LogUsageSubscription>[];

  getProfileUrl(commonService: CommonService): string | null {
    const commonConfig = commonService.getConfig('common');
    return this.profile ? `${commonConfig.serverUrl}/api/static/image/${this.profile.filename}?t=p&q=100&rs=jpeg` : null;
  }
}
