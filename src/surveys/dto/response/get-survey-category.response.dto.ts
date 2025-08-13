import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { GetCategoryNestedResponseDto } from './get-category.nested.response.dto';

export class GetSurveyCategoryResponseDto extends GetResponse<GetCategoryNestedResponseDto[]> {
  @ApiProperty({ description: '메시지', example: ErrorMessage.SUCCESS_GET_CATEGORY_LIST })
  message: string = ErrorMessage.SUCCESS_GET_CATEGORY_LIST;

  @ApiProperty({
    description: '카테고리 목록',
    example: ['카테고리1', '카테고리2', '카테고리3'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  declare payload: GetCategoryNestedResponseDto[];

  constructor(payload: GetCategoryNestedResponseDto[] = [new GetCategoryNestedResponseDto()]) {
    super(payload);
  }
}
