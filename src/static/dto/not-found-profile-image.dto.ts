import { NotFoundResponseDto } from '@common/dto/global-response.dto';

export class NotFoundProfileImageDto extends NotFoundResponseDto {
  message = '프로필 이미지를 찾을 수 없습니다.';
}
