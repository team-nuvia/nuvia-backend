import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserSecretResponseDto extends SuccessResponse {
  @ApiProperty({ description: '비밀번호 생성 성공', example: '비밀번호 생성 성공' })
  message: string = '비밀번호 생성 성공';
}
