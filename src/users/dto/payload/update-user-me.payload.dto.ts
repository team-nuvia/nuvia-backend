import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserMePayloadDto {
  @ApiProperty({ description: '이름', example: '홍길동' })
  @IsOptional()
  @IsString()
  nickname!: string;
}
