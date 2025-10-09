import { ApiProperty } from '@nestjs/swagger';

export class AuthorNestedResponseDto {
  @ApiProperty({ description: '작성자 ID', example: 1 })
  id: number = 1;

  @ApiProperty({ description: '작성자 이름', example: '홍길동' })
  name: string = '홍길동';

  @ApiProperty({ description: '작성자 프로필 이미지', example: 'https://example.com/profile.jpg' })
  profileImage: string | null = null;
}
