import { ErrorMessage, SuccessResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class CsrfTokenNestedResponseDto {
  @ApiProperty({ description: 'CSRF 토큰', example: '<token>' })
  token: string = '<token>';
}

export class CsrfTokenResponseDto extends SuccessResponse<CsrfTokenNestedResponseDto> {
  @ApiProperty({ example: ErrorMessage.SUCCESS_CREATE_CSRF_TOKEN })
  message: string = ErrorMessage.SUCCESS_CREATE_CSRF_TOKEN;

  @ApiProperty({ description: 'CSRF 토큰', type: () => CsrfTokenNestedResponseDto })
  declare payload: CsrfTokenNestedResponseDto;

  constructor(payload: CsrfTokenNestedResponseDto = new CsrfTokenNestedResponseDto()) {
    super(payload);
  }
}
