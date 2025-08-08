import { ErrorMessage } from '@common/dto/response';
import { GetResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';
import { GetUserMeNestedResponseDto } from './get-user-me.nested.response.dto';

export class GetUserMeResponseDto extends GetResponse<GetUserMeNestedResponseDto> {
  @ApiProperty({ example: ErrorMessage.SUCCESS_GET_USER_ME })
  message: string = ErrorMessage.SUCCESS_GET_USER_ME;

  @ApiProperty({ description: '사용자 정보', type: () => GetUserMeNestedResponseDto })
  declare payload: GetUserMeNestedResponseDto;

  constructor(payload: GetUserMeNestedResponseDto = new GetUserMeNestedResponseDto()) {
    super(payload);
  }
}
