export const PermissionGrantType = {
  TeamInvite: 'team.invite',
  TeamBan: 'team.ban',
  TeamRoleEdit: 'team.role.edit',
  TeamInfoEdit: 'team.info.edit',
  TeamInfoDelete: 'team.info.delete',
  SurveyCreate: 'survey.create',
  SurveyUpdate: 'survey.update',
  SurveyDelete: 'survey.delete',
  DownloadReport: 'download.report',
  SurveyAnswerView: 'survey.answer.view',
  ViewSurveyResult: 'view.survey.result',
  ViewSurveyDetail: 'view.survey.detail',
} as const;
export type PermissionGrantType = (typeof PermissionGrantType)[keyof typeof PermissionGrantType];
