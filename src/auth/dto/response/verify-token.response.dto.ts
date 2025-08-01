import { SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { VerifyTokenNestedResponseDto } from './verify-token.nested.response.dto';

export class VerifyTokenResponseDto extends SuccessResponse<VerifyTokenNestedResponseDto> {
  @ApiProperty({ description: '토큰 검증 성공', example: '토큰 검증 성공' })
  declare message: string;

  @ApiProperty({ description: '토큰 검증 성공', type: VerifyTokenNestedResponseDto })
  declare payload: VerifyTokenNestedResponseDto;
}
