import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { GetUserAccessNestedDto } from './get-user-access.nested.dto';

export class GetUserAccessesResponseDto extends GetResponse<GetUserAccessNestedDto[]> {
  @ApiProperty({ description: '메시지', example: ErrorMessage.SUCCESS_GET_USER_ACCESS_LIST })
  message: string = ErrorMessage.SUCCESS_GET_USER_ACCESS_LIST;

  @ApiProperty({ description: '데이터', type: () => GetUserAccessNestedDto, isArray: true })
  declare payload: GetUserAccessNestedDto[];

  constructor(payload: GetUserAccessNestedDto[] = [new GetUserAccessNestedDto()]) {
    super(payload);
    this.payload = payload;
  }
}
