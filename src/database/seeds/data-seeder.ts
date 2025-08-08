import { PlanBilling } from '@/plans/entities/plan-billing.entity';
import { Plan } from '@/plans/entities/plan.entity';
import { PlanGrantConstraintsType } from '@/plans/enums/plan-grant-constraints-type.enum';
import { PlanGrantType } from '@/plans/enums/plan-grant-type.enum';
import { PlanNameType } from '@/plans/enums/plan-name-type.enum';
import { PlanGrant } from '@/plans/plan-grants/entities/plan-grant.entity';
import { BillingCycleType } from '@share/enums/billing-cycle-type';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class DataSeeder implements Seeder {
  public async run(dataSource: DataSource, _factoryManager: SeederFactoryManager): Promise<any> {
    await this.seedPlans(dataSource);
  }

  private async seedPlans(dataSource: DataSource) {
    const planRepository = dataSource.getRepository(Plan);

    await planRepository.manager.connection.transaction(async (manager) => {
      await manager.createQueryBuilder().delete().from(PlanBilling).execute();
      await manager.createQueryBuilder().delete().from(PlanGrant).execute();
      await manager.createQueryBuilder().delete().from(Plan).execute();

      await manager.query(`ALTER TABLE \`plan_grant\` AUTO_INCREMENT = 1`);
      await manager.query(`ALTER TABLE \`plan_billing\` AUTO_INCREMENT = 1`);
      await manager.query(`ALTER TABLE \`plan\` AUTO_INCREMENT = 1`);
    });

    await planRepository.insert([
      {
        name: PlanNameType.Free,
        description: 'Free plan',
        planBilling: {
          price: 3000,
          billingCycle: BillingCycleType.MONTHLY,
        },
        planGrants: [
          {
            planId: 1,
            type: PlanGrantType.Limit,
            description: '설문 생성 제한',
            constraints: PlanGrantConstraintsType.SurveyCreate,
            amount: 3,
            isRenewable: true,
            isAllowed: true,
          },
          {
            planId: 1,
            type: PlanGrantType.Limit,
            description: '설문 별 질문 수 제한',
            constraints: PlanGrantConstraintsType.PerQuestionForSurvey,
            amount: 5,
            isRenewable: true,
            isAllowed: true,
          },
          {
            planId: 1,
            type: PlanGrantType.Allow,
            description: '파일 업로드 제한',
            constraints: PlanGrantConstraintsType.FileUpload,
            amount: null,
            isRenewable: false,
            isAllowed: false,
          },
          {
            planId: 1,
            type: PlanGrantType.Allow,
            description: '파일 다운로드 제한',
            constraints: PlanGrantConstraintsType.Download,
            amount: null,
            isRenewable: false,
            isAllowed: false,
          },
          {
            planId: 1,
            type: PlanGrantType.Allow,
            description: '팀 최대 인원',
            constraints: PlanGrantConstraintsType.TeamInvite,
            amount: null,
            isRenewable: false,
            isAllowed: false,
          },
        ],
      },
      {
        name: PlanNameType.Basic,
        description: 'Basic Plan',
        planBilling: {
          price: 7000,
          billingCycle: BillingCycleType.MONTHLY,
        },
        planGrants: [
          {
            planId: 2,
            type: PlanGrantType.Limit,
            description: '설문 생성 제한',
            constraints: PlanGrantConstraintsType.SurveyCreate,
            amount: 30,
            isRenewable: true,
            isAllowed: true,
          },
          {
            planId: 2,
            type: PlanGrantType.Limit,
            description: '설문 별 질문 수 제한',
            constraints: PlanGrantConstraintsType.PerQuestionForSurvey,
            amount: 10,
            isRenewable: true,
            isAllowed: true,
          },
          {
            planId: 2,
            type: PlanGrantType.Allow,
            description: '파일 업로드 제한',
            constraints: PlanGrantConstraintsType.FileUploadImage,
            amount: null,
            isRenewable: false,
            isAllowed: true,
          },
          {
            planId: 2,
            type: PlanGrantType.Allow,
            description: '파일 다운로드 제한',
            constraints: PlanGrantConstraintsType.DownloadPdf,
            amount: null,
            isRenewable: false,
            isAllowed: true,
          },
          {
            planId: 2,
            type: PlanGrantType.Allow,
            description: '팀 최대 인원',
            constraints: PlanGrantConstraintsType.TeamInvite,
            amount: 5,
            isRenewable: false,
            isAllowed: true,
          },
        ],
      },
      {
        name: PlanNameType.Premium,
        description: 'Premium plan',
        planBilling: {
          price: 12000,
          billingCycle: BillingCycleType.MONTHLY,
        },
        planGrants: [
          {
            planId: 3,
            type: PlanGrantType.Limit,
            description: '설문 생성 제한',
            constraints: PlanGrantConstraintsType.SurveyCreate,
            amount: 30,
            isRenewable: true,
            isAllowed: true,
          },
          {
            planId: 3,
            type: PlanGrantType.Limit,
            description: '설문 별 질문 수 제한',
            constraints: PlanGrantConstraintsType.PerQuestionForSurvey,
            amount: 10,
            isRenewable: true,
            isAllowed: true,
          },
          {
            planId: 3,
            type: PlanGrantType.Allow,
            description: '파일 업로드 제한',
            constraints: PlanGrantConstraintsType.FileUploadImage,
            amount: null,
            isRenewable: false,
            isAllowed: true,
          },
          {
            planId: 3,
            type: PlanGrantType.Allow,
            description: '파일 다운로드 제한',
            constraints: [PlanGrantConstraintsType.DownloadPdf, PlanGrantConstraintsType.DownloadXlsx].join(','),
            amount: null,
            isRenewable: false,
            isAllowed: true,
          },
          {
            planId: 3,
            type: PlanGrantType.Allow,
            description: '팀 최대 인원',
            constraints: PlanGrantConstraintsType.TeamInvite,
            amount: 5,
            isRenewable: false,
            isAllowed: true,
          },
        ],
      },
    ]);
  }
}
