import { ErrorMessage } from '@common/dto/response';
import { GetResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto extends GetResponse<null> {
  @ApiProperty({ example: ErrorMessage.LOGIN_SUCCESS })
  message: string = ErrorMessage.LOGIN_SUCCESS;
}
