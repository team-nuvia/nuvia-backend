import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StartAnswerPayloadDto {
  @ApiProperty({
    description: '사용자 에이전트',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  })
  @IsString()
  userAgent!: string;
}
