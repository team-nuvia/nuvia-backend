import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { GetBasicAnalysesNestedResponseDto } from './get-basic-analyses.nested.response.dto';

export class GetBasicAnalysesResponseDto extends GetResponse<GetBasicAnalysesNestedResponseDto> {
  @ApiProperty({ description: '메시지', example: ErrorMessage.SUCCESS_GET_BASIC_ANALYSES })
  message: string = ErrorMessage.SUCCESS_GET_BASIC_ANALYSES;

  @ApiProperty({ description: '기본 분석 데이터', type: () => GetBasicAnalysesNestedResponseDto })
  declare payload: GetBasicAnalysesNestedResponseDto;

  constructor(payload: GetBasicAnalysesNestedResponseDto = new GetBasicAnalysesNestedResponseDto()) {
    super(payload);
  }
}
