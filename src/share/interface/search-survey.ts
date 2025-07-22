export interface SearchSurvey {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'closed';
  responses: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  estimatedTime: number;
  questions: number;
  category: string;
  isPublic: boolean;
}