import { Notification } from '@/notifications/entities/notification.entity';
import { Payment } from '@/payments/entities/payment.entity';
import { LogUsageSubscription } from '@/subscriptions/entities/log-usage-subscription.entity';
import { Subscription } from '@/subscriptions/entities/subscription.entity';
import { OrganizationRole } from '@/subscriptions/organization-roles/entities/organization-role.entity';
import { Answer } from '@/surveys/entities/answer.entity';
import { Survey } from '@/surveys/entities/survey.entity';
import { CommonService } from '@common/common.service';
import { DefaultDateInterface } from '@common/interface/default-date.interface';
import { UserSecret } from '@user-secrets/entities/user-secret.entity';
import { Profile } from '@users/profiles/entities/profile.entity';
import { UserAccess } from '@users/user-accesses/entities/user-access.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { UserProvider } from './user-provider.entity';
import { BoolTinyIntTransformer } from '@common/transformer/bool.transformer';

@Entity()
export class User extends DefaultDateInterface {
  @PrimaryGeneratedColumn({ comment: '사용자 PK' })
  id!: number;

  @Column('tinyint', { default: false, transformer: BoolTinyIntTransformer, comment: '이용약관 및 개인정보 처리방침 동의 여부' })
  termsAgreed!: boolean;

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

  @OneToMany(() => Answer, (answer) => answer.user, {
    cascade: true,
  })
  answers!: Relation<Answer>[];

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

  @OneToMany(() => Subscription, (subscription) => subscription.user, {
    cascade: true,
  })
  subscriptions!: Relation<Subscription>[];

  @OneToMany(() => LogUsageSubscription, (logUsageSubscription) => logUsageSubscription.user, {
    cascade: true,
  })
  logUsageSubscriptions!: Relation<LogUsageSubscription>[];

  @OneToMany(() => Notification, (notification) => notification.from, {
    cascade: true,
  })
  notificationsFrom!: Relation<Notification>[];

  @OneToMany(() => Notification, (notification) => notification.to, {
    cascade: true,
  })
  notificationsTo!: Relation<Notification>[];

  @OneToMany(() => UserProvider, (userProvider) => userProvider.user, {
    cascade: true,
  })
  userProviders!: Relation<UserProvider>[];

  getProfileUrl(commonService: CommonService): string | null {
    const commonConfig = commonService.getConfig('common');
    return this.profile ? `${commonConfig.serverUrl}/api/v1/static/image/${this.profile.filename}?type=p&quality=100&responseType=jpeg` : null;
  }

  get userProvider(): UserProvider {
    return this.userProviders[0];
  }
}
