import { ApiPropertyNullable } from '@common/decorator/api-property-nullable.decorator';
import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto extends SuccessResponse<null> {
  @ApiProperty({ description: '로그아웃 성공', example: '로그아웃 성공' })
  declare message: string;

  @ApiPropertyNullable({ description: '토큰', example: null })
  declare payload: null;
}
