import { GetResponse } from '@common/dto/response/response.interface';
import { UserMeNestedResponseDto } from '@common/dto/response/user-me.nested.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserMeResponseDto extends GetResponse<UserMeNestedResponseDto> {
  @ApiProperty({ description: '사용자 정보 조회 성공', example: '사용자 정보 조회 성공' })
  declare message: string;

  @ApiProperty({ description: '사용자 정보', type: UserMeNestedResponseDto })
  declare payload: UserMeNestedResponseDto;
}
