import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserSecretResponseDto extends SuccessResponse<null> {
  @ApiProperty({ description: '비밀번호 생성 성공', example: '비밀번호 생성 성공' })
  declare message: string;
}
