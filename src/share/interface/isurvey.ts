import { AllQuestion } from './iquestion';

export interface ISurvey {
  id?: number;
  title: string;
  description: string;
  expiresAt: string | null;
  isPublic: boolean;
  questions: AllQuestion[];
  status: 'active' | 'draft' | 'closed';
  startDate?: Date;
  endDate?: Date;
  category: string;
  managementPassword?: string;
  createdAt: Date;
  updatedAt: Date;
}
