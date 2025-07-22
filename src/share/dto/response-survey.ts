import { IQuestion } from '@share/interface/iquestion';

export interface IResponseSurvey {
  title: string;
  name: string;
  description: string;
  category: string;
  expiresAt: string;
  isPublic: boolean;
  participants: number;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}
