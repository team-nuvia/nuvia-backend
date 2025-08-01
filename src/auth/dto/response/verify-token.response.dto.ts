import { SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyTokenResponseDto extends SuccessResponse {
  @ApiProperty({ description: '토큰 검증 성공', example: '토큰 검증 성공' })
  declare message: string;

  @ApiProperty({ description: '토큰 검증 성공', example: true })
  declare payload: boolean;
}
