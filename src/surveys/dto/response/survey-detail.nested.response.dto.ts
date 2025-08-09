import { SurveyStatus } from '@share/enums/survey-status';
import { QuestionDetailNestedResponseDto } from './question-detail.nested.response.dto';

export class SurveyDetailNestedResponseDto {
  id!: number;
  title!: string;
  description!: string | null;
  author!: {
    name: string;
    profileImage: string | null;
  };
  estimatedTime!: number;
  totalResponses!: number;
  questions!: QuestionDetailNestedResponseDto[];
  isPublic!: boolean;
  status!: SurveyStatus;
  questionCount!: number;
  respondentCount!: number;
  isOwner!: boolean;
  expiresAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}
