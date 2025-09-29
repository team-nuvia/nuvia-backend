import { ErrorMessage, GetResponse } from '@common/dto/response';
import { PaginatedResponseDto } from '@common/interface/paginated.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { GetUserAccessNestedDto } from './get-user-access.nested.dto';

export class GetAllUserAccesseListPaginatedResponseDto implements PaginatedResponseDto<GetUserAccessNestedDto> {
  @ApiProperty({ description: '페이지', example: 1 })
  page: number = 1;

  @ApiProperty({ description: '페이지 크기', example: 10 })
  limit: number = 10;

  @ApiProperty({ description: '총 설문 개수', example: 100 })
  total: number = 100;

  @ApiProperty({ description: '삭제된 설문 데이터', type: () => GetAllUserAccesseListPaginatedResponseDto, isArray: true })
  data: GetUserAccessNestedDto[] = [new GetUserAccessNestedDto()];
}

export class GetAllUserAccesseListResponseDto extends GetResponse<GetAllUserAccesseListPaginatedResponseDto> {
  @ApiProperty({ description: '메시지', example: ErrorMessage.SUCCESS_GET_USER_ACCESS_LIST })
  message: string = ErrorMessage.SUCCESS_GET_USER_ACCESS_LIST;

  @ApiProperty({ description: '데이터', type: () => GetAllUserAccesseListPaginatedResponseDto, isArray: true })
  declare payload: GetAllUserAccesseListPaginatedResponseDto;

  constructor(payload: GetAllUserAccesseListPaginatedResponseDto = new GetAllUserAccesseListPaginatedResponseDto()) {
    super(payload);
  }
}
