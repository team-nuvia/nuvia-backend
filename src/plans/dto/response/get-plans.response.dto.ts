import { ErrorMessage } from '@common/dto/response';
import { GetResponse } from '@common/dto/response/response.interface';
import { ApiProperty } from '@nestjs/swagger';
import { GetPlansNestedResponseDto } from './get-plans.nested.response.dto';

export class GetPlansResponseDto extends GetResponse<GetPlansNestedResponseDto[]> {
  @ApiProperty({ example: ErrorMessage.SUCCESS_GET_PLANS })
  message: string = ErrorMessage.SUCCESS_GET_PLANS;

  @ApiProperty({ description: '플랜 데이터', type: () => GetPlansNestedResponseDto, isArray: true })
  declare payload: GetPlansNestedResponseDto[];

  constructor(payload: GetPlansNestedResponseDto[] = [new GetPlansNestedResponseDto()]) {
    super(payload);
  }
}
