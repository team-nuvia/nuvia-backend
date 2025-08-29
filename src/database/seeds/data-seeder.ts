import { Permission } from '@/permissions/entities/permission.entity';
import { PermissionGrantType } from '@/permissions/enums/permission-grant-type.enum';
import { PermissionGrant } from '@/permissions/permission-grants/entities/permission-grant.entity';
import { Plan } from '@/plans/entities/plan.entity';
import { PlanGrantConstraintsType } from '@/plans/enums/plan-grant-constraints-type.enum';
import { PlanGrant } from '@/plans/plan-grants/entities/plan-grant.entity';
import { Category } from '@/surveys/entities/category.entity';
import { PlanGrantType } from '@share/enums/plan-grant-type.enum';
import { PlanNameType } from '@share/enums/plan-name-type.enum';
import { UserRole } from '@share/enums/user-role';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class DataSeeder implements Seeder {
  public async run(dataSource: DataSource, _factoryManager: SeederFactoryManager): Promise<any> {
    const manager = dataSource.manager;

    /* 관계형 역순 데이터 제거 */
    await manager.createQueryBuilder().delete().from(PlanGrant).execute();

    await manager.createQueryBuilder().delete().from(Plan).execute();

    await manager.createQueryBuilder().delete().from(PermissionGrant).execute();

    await manager.createQueryBuilder().delete().from(Permission).execute();

    /* 시퀀스 초기화 */
    await manager.query(`ALTER TABLE \`plan_grant\` AUTO_INCREMENT = 1`);
    await manager.query(`ALTER TABLE \`plan\` AUTO_INCREMENT = 1`);
    await manager.query(`ALTER TABLE \`permission_grant\` AUTO_INCREMENT = 1`);
    await manager.query(`ALTER TABLE \`permission\` AUTO_INCREMENT = 1`);

    await this.seedCategories(dataSource);
    await this.seedPermissions(dataSource);
    await this.seedPermissionGrants(dataSource);
    await this.seedPlans(dataSource);
  }

  //@ts-ignore
  private async seedCategories(dataSource: DataSource) {
    const manager = dataSource.manager;

    await manager.createQueryBuilder().delete().from(Category).execute();
    await manager.query(`ALTER TABLE \`category\` AUTO_INCREMENT = 1`);

    const categories = ['Daily Life', 'Hobbies', 'Career', 'Others'];
    const categoryRepository = dataSource.getRepository(Category);
    await categoryRepository.insert(categories.map((name) => ({ name })));
  }

  //@ts-ignore
  private async seedPermissionGrants(dataSource: DataSource) {
    const permissionGrantRepository = dataSource.getRepository(PermissionGrant);

    const createPermissions = (permissionId: number, grants: { type: PermissionGrantType; description: string; isAllowed: boolean }[]) => {
      return grants.map((grant) => {
        return {
          permissionId,
          type: grant.type,
          description: grant.description,
          isAllowed: grant.isAllowed,
        };
      });
    };

    const viewerPermissions = createPermissions(1, [
      {
        type: PermissionGrantType.SurveyCreate,
        description: '설문 생성 권한',
        isAllowed: false,
      },
      {
        type: PermissionGrantType.SurveyUpdate,
        description: '설문 수정 권한',
        isAllowed: false,
      },
      {
        type: PermissionGrantType.SurveyDelete,
        description: '설문 삭제 권한',
        isAllowed: false,
      },
      {
        type: PermissionGrantType.SurveyAnswerView,
        description: '설문 답변 조회 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.TeamBan,
        description: '팀 추방 권한',
        isAllowed: false,
      },
      {
        type: PermissionGrantType.TeamInvite,
        description: '팀 초대 권한',
        isAllowed: false,
      },
      {
        type: PermissionGrantType.TeamRoleEdit,
        description: '팀 역할 수정 권한',
        isAllowed: false,
      },
      {
        type: PermissionGrantType.TeamInfoEdit,
        description: '팀 정보 수정 권한',
        isAllowed: false,
      },
      {
        type: PermissionGrantType.TeamInfoDelete,
        description: '팀 정보 삭제 권한',
        isAllowed: false,
      },
      {
        type: PermissionGrantType.DownloadReport,
        description: '리포트 다운로드 권한',
        isAllowed: false,
      },
      {
        type: PermissionGrantType.ViewSurveyDetail,
        description: '설문 상세 조회 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.ViewSurveyResult,
        description: '설문 결과 조회 권한',
        isAllowed: true,
      },
    ]);

    const editorPermissions = createPermissions(2, [
      {
        type: PermissionGrantType.SurveyCreate,
        description: '설문 생성 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.SurveyUpdate,
        description: '설문 수정 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.SurveyDelete,
        description: '설문 삭제 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.SurveyAnswerView,
        description: '설문 답변 조회 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.TeamBan,
        description: '팀 추방 권한',
        isAllowed: false,
      },
      {
        type: PermissionGrantType.TeamInvite,
        description: '팀 초대 권한',
        isAllowed: false,
      },
      {
        type: PermissionGrantType.TeamRoleEdit,
        description: '팀 역할 수정 권한',
        isAllowed: false,
      },
      {
        type: PermissionGrantType.TeamInfoEdit,
        description: '팀 정보 수정 권한',
        isAllowed: false,
      },
      {
        type: PermissionGrantType.TeamInfoDelete,
        description: '팀 정보 삭제 권한',
        isAllowed: false,
      },
      {
        type: PermissionGrantType.DownloadReport,
        description: '리포트 다운로드 권한',
        isAllowed: false,
      },
      {
        type: PermissionGrantType.ViewSurveyDetail,
        description: '설문 상세 조회 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.ViewSurveyResult,
        description: '설문 결과 조회 권한',
        isAllowed: true,
      },
    ]);

    const adminPermissions = createPermissions(3, [
      {
        type: PermissionGrantType.SurveyCreate,
        description: '설문 생성 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.SurveyUpdate,
        description: '설문 수정 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.SurveyDelete,
        description: '설문 삭제 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.SurveyAnswerView,
        description: '설문 답변 조회 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.TeamBan,
        description: '팀 추방 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.TeamInvite,
        description: '팀 초대 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.TeamRoleEdit,
        description: '팀 역할 수정 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.TeamInfoEdit,
        description: '팀 정보 수정 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.TeamInfoDelete,
        description: '팀 정보 삭제 권한',
        isAllowed: false,
      },
      {
        type: PermissionGrantType.DownloadReport,
        description: '리포트 다운로드 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.ViewSurveyDetail,
        description: '설문 상세 조회 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.ViewSurveyResult,
        description: '설문 결과 조회 권한',
        isAllowed: true,
      },
    ]);

    const ownerPermissions = createPermissions(4, [
      {
        type: PermissionGrantType.SurveyCreate,
        description: '설문 생성 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.SurveyUpdate,
        description: '설문 수정 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.SurveyDelete,
        description: '설문 삭제 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.SurveyAnswerView,
        description: '설문 답변 조회 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.TeamBan,
        description: '팀 추방 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.TeamInvite,
        description: '팀 초대 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.TeamRoleEdit,
        description: '팀 역할 수정 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.TeamInfoEdit,
        description: '팀 정보 수정 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.TeamInfoDelete,
        description: '팀 정보 삭제 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.DownloadReport,
        description: '리포트 다운로드 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.ViewSurveyDetail,
        description: '설문 상세 조회 권한',
        isAllowed: true,
      },
      {
        type: PermissionGrantType.ViewSurveyResult,
        description: '설문 결과 조회 권한',
        isAllowed: true,
      },
    ]);

    await permissionGrantRepository.insert([...viewerPermissions, ...editorPermissions, ...adminPermissions, ...ownerPermissions]);
  }

  //@ts-ignore
  private async seedPermissions(dataSource: DataSource) {
    const permissionRepository = dataSource.getRepository(Permission);

    permissionRepository.insert([
      {
        role: UserRole.Viewer,
        description: '뷰어',
        sequence: 1,
        isDefault: true,
        isDeprecated: false,
      },
      {
        role: UserRole.Editor,
        description: '편집자',
        sequence: 2,
        isDefault: false,
        isDeprecated: false,
      },
      {
        role: UserRole.Admin,
        description: '관리자',
        sequence: 3,
        isDefault: false,
        isDeprecated: false,
      },
      {
        role: UserRole.Owner,
        description: '소유자',
        sequence: 4,
        isDefault: false,
        isDeprecated: false,
      },
    ]);
  }

  //@ts-ignore
  private async seedPlans(dataSource: DataSource) {
    const planRepository = dataSource.getRepository(Plan);
    const planGrantRepository = dataSource.getRepository(PlanGrant);

    await planRepository.insert([
      {
        name: PlanNameType.Free,
        description: 'Free plan',
        price: 3000,
      },
      {
        name: PlanNameType.Basic,
        description: 'Basic Plan',
        price: 7000,
      },
      {
        name: PlanNameType.Premium,
        description: 'Premium plan',
        price: 12000,
      },
    ]);

    await planGrantRepository.insert([
      /* free plan */
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
        amount: 10,
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
      /* basic plan */
      {
        planId: 2,
        type: PlanGrantType.Limit,
        description: '설문 생성 제한',
        constraints: PlanGrantConstraintsType.SurveyCreate,
        amount: 15,
        isRenewable: true,
        isAllowed: true,
      },
      {
        planId: 2,
        type: PlanGrantType.Limit,
        description: '설문 별 질문 수 제한',
        constraints: PlanGrantConstraintsType.PerQuestionForSurvey,
        amount: 30,
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
        amount: 10,
        isRenewable: false,
        isAllowed: true,
      },
      /* premium plan */
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
        amount: 50,
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
        amount: 30,
        isRenewable: false,
        isAllowed: true,
      },
    ]);
  }
}
