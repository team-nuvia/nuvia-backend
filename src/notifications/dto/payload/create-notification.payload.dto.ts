import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationPayloadDto {
  @ApiProperty({
    example: 1,
  })
  toId!: number;

  @ApiProperty({
    example: '알림 제목',
  })
  title!: string;

  @ApiProperty({
    example: '알림 내용',
  })
  content!: string;
}
