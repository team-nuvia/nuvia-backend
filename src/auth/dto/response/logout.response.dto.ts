import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { ErrorMessage } from '@common/dto/response';
import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto extends SuccessResponse<null> {
  @ApiProperty({ example: ErrorMessage.SUCCESS_LOGOUT })
  message: string = ErrorMessage.SUCCESS_LOGOUT;

  @ApiPropertyNullable({ description: '토큰', example: null })
  declare payload: null;

  constructor(payload: null = null) {
    super(payload);
  }
}
