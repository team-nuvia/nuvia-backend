import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';
import { UserSecretNestedParamDto } from '../param/user-secret.nested.param.dto';

export class UpdateUserSecretResponseDto extends SuccessResponse<UserSecretNestedParamDto> {
  @ApiProperty({ description: '비밀번호 변경 성공', example: '비밀번호 변경 성공' })
  declare message: string;

  @ApiProperty({ description: '비밀번호 변경 성공', type: UserSecretNestedParamDto })
  declare payload: UserSecretNestedParamDto;
}
