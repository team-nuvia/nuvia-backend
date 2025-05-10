import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({
    type: () => Buffer,
    description: '파일',
    default: Buffer.from([]),
  })
  file!: Buffer;
}
