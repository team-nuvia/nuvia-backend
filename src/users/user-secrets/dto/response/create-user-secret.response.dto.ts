import { ErrorMessage } from '@common/dto/response';
import { SuccessResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserSecretResponseDto extends SuccessResponse<null> {
  @ApiProperty({ example: ErrorMessage.SUCCESS_CREATE_USER_SECRET })
  message: string = ErrorMessage.SUCCESS_CREATE_USER_SECRET;
}
