import { ApiProperty } from '@nestjs/swagger';
import { ErrorMessage, UnauthorizedException } from '../response';

export class RefreshTokenRequiredExceptionDto extends UnauthorizedException {
  @ApiProperty({
    example: ErrorMessage.REFRESH_TOKEN_REQUIRED,
  })
  declare message: string;
}
