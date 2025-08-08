import { SurveyStatus } from '@share/enums/survey-status';

export class DashboardSurveyNestedResponseDto {
  id!: number;
  title!: string;
  description!: string | null;
  isPublic!: boolean;
  status!: SurveyStatus;
  questionCount!: number;
  respondentCount!: number;
  expiresAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}
