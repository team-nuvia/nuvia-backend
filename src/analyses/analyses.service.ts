import { Injectable } from '@nestjs/common';
import { AnalysesRepository } from './analyses.repository';
import { NotFoundOrganizationRoleExceptionDto } from '@/subscriptions/organization-roles/dto/exception/not-found-organization-role.exception.dto';
import { isNil } from '@util/isNil';
import { BadRequestException } from '@common/dto/response';

@Injectable()
export class AnalysesService {
  constructor(private readonly analysesRepository: AnalysesRepository) {}

  async findBasicAnalyses(surveyId: number, userId: number) {
    if (!surveyId) {
      throw new BadRequestException();
    }

    const subscription = await this.analysesRepository.getCurrentOrganization(userId);

    if (isNil(subscription)) {
      throw new NotFoundOrganizationRoleExceptionDto();
    }

    const permission = await this.analysesRepository.getUserAllowedPermission(userId);
    const overview = await this.analysesRepository.getOverviewAnalysis(surveyId, subscription.id);
    const questions = await this.analysesRepository.getQuestionDetails(surveyId, subscription.id);
    return { permission, overview, questions };
  }
}
