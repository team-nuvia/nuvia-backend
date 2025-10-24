import { ApiProperty } from '@nestjs/swagger';
import { OverviewAnalysisNestedResponseDto } from './overview-analysis.nested.response.response.dto';
import { QuestionDetailNestedResponseDto } from './question-detail.nested.response.dto';
import { UserAllowedPermissionNestedResponseDto } from './user-allowed-permission.nested.response.dto';

export class GetBasicAnalysesNestedResponseDto {
  @ApiProperty({ description: '사용자 권한', type: () => UserAllowedPermissionNestedResponseDto })
  permission: UserAllowedPermissionNestedResponseDto = new UserAllowedPermissionNestedResponseDto();

  @ApiProperty({ description: '기본 분석 데이터', type: () => OverviewAnalysisNestedResponseDto })
  overview: OverviewAnalysisNestedResponseDto = new OverviewAnalysisNestedResponseDto();

  @ApiProperty({ description: '질문 목록', type: () => QuestionDetailNestedResponseDto, isArray: true })
  questions: QuestionDetailNestedResponseDto[] = [new QuestionDetailNestedResponseDto()];
}
