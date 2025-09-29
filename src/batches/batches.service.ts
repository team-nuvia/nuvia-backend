import { EmailsService } from '@/emails/emails.service';
import { CommonService } from '@common/common.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from '@users/entities/user.entity';
import { UserSecret } from '@users/user-secrets/entities/user-secret.entity';
import { OrmHelper } from '@util/orm.helper';

@Injectable()
export class BatchesService {
  constructor(
    private readonly orm: OrmHelper,
    private readonly emailsService: EmailsService,
    private readonly commonService: CommonService,
  ) {}
  // @Cron(CronExpression.EVERY_12_HOURS)
  // async handleCronExample() {
  //   console.log('Cron job executed');
  // }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async handleCron() {
    console.log('Cron job executed every day at 6am');

    const DAY = 60;
    const subQuery = this.orm.getRepo(User).createQueryBuilder('u').where('u.id IS NOT NULL').select('u.id').getQuery();
    const users = await this.orm
      .getRepo(UserSecret)
      .createQueryBuilder('us')
      .where('DATE(us.updatedAt) <= DATE(DATE_SUB(NOW(), INTERVAL :day DAY))', { day: DAY })
      .andWhere('us.id IS NOT NULL')
      .andWhere(`us.userId IN (${subQuery})`)
      .getMany();

    if (users.length === 0) return;

    const clientUrl = this.commonService.getConfig('common').clientUrl;
    const targetUsers = await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .where('u.id IN (:...ids)', { ids: users.map((user) => user.userId) })
      .leftJoinAndSelect('u.userProviders', 'up')
      .getMany();

    await Promise.all(
      targetUsers
        .flatMap((user) => user.userProviders)
        .map((provider) =>
          this.emailsService.sendChangePasswordMail(provider.email, '누비아 활동 알림', {
            userName: provider.name,
            title: '누비아 활동 알림',
            changePasswordUrl: `${clientUrl}/dashboard/user/settings`,
          }),
        ),
    );
  }
}
