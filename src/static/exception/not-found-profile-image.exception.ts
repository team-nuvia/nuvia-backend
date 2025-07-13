import { NotFoundException } from '@common/dto/response';

export class NotFoundProfileImageException extends NotFoundException {
  message = '프로필 이미지를 찾을 수 없습니다.';
}
