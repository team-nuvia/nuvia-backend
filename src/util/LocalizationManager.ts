import { MetadataStatusType } from '@share/enums/metadata-status-type';
import { NotificationActionStatus } from '@share/enums/notification-action-status';
import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';
import { SurveyStatus } from '@share/enums/survey-status';
import { UserRole } from '@share/enums/user-role';

export const TRANSLATE_TOKEN = {
  [SurveyStatus.Draft]: '초안',
  [SurveyStatus.Active]: '진행중',
  [SurveyStatus.Closed]: '마감',
  [UserRole.Viewer]: '뷰어',
  [UserRole.Editor]: '편집자',
  [UserRole.Admin]: '관리자',
  [UserRole.Owner]: '소유자',
  [OrganizationRoleStatusType.Invited]: '초대됨',
  [OrganizationRoleStatusType.Joined]: '참여',
  [OrganizationRoleStatusType.Deactivated]: '비활성',
  [MetadataStatusType.Dashboard]: '대시보드',
  [MetadataStatusType.SurveyList]: '설문 목록',
  ['notification.' + NotificationActionStatus.Joined]: '초대됨',
  ['notification.' + NotificationActionStatus.Rejected]: '거절',
} as const;
export type TRANSLATE_TOKEN = (typeof TRANSLATE_TOKEN)[keyof typeof TRANSLATE_TOKEN];

export class LocalizationManager {
  static translate(key: keyof typeof TRANSLATE_TOKEN) {
    return TRANSLATE_TOKEN[key];
  }
}
