import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class InviteSubscriptionPayloadDto {
  @ApiProperty({
    description: '초대할 이메일 목록',
    example: ['test@test.com', 'test2@test.com'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1)
  emails!: string[];
}
