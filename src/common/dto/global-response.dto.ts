import { ApiProperty } from '@nestjs/swagger';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from './response/response.interface';

/* 400 에러 응답 */
export class BadRequestResponseDto extends BadRequestException {
  @ApiProperty({
    name: 'message',
    type: String,
    example: '잘못된 요청입니다.',
  })
  declare message: string;

  constructor(
    reason: string | null = null,
    message: string = '잘못된 요청입니다.',
  ) {
    super(message, reason);
  }
}

/* 401 에러 응답 */
export class UnauthorizedResponseDto extends UnauthorizedException {
  @ApiProperty({
    name: 'message',
    type: String,
    example: '인증에 문제가 발생했습니다.',
  })
  declare message: string;

  constructor(
    reason: string | null = null,
    message: string = '인증에 문제가 발생했습니다.',
  ) {
    super(message, reason);
  }
}

/* 403 에러 응답 */
export class ForbiddenResponseDto extends ForbiddenException {
  @ApiProperty({
    name: 'message',
    type: String,
    example: '권한이 없습니다.',
  })
  declare message: string;

  constructor(
    reason: string | null = null,
    message: string = '권한이 없습니다.',
  ) {
    super(message, reason);
  }
}

/* 404 에러 응답 */
export class NotFoundResponseDto extends NotFoundException {
  @ApiProperty({
    name: 'message',
    type: String,
    example: '리소스를 찾지 못했습니다.',
  })
  declare message: string;

  constructor(
    reason: string | null = null,
    message: string = '리소스를 찾지 못했습니다.',
  ) {
    super(message, reason);
  }
}

/* 409 에러 응답 */
export class ConflictResponseDto extends ConflictException {
  @ApiProperty({
    name: 'message',
    type: String,
    example: '중복된 리소스가 존재합니다.',
  })
  declare message: string;

  constructor(
    reason: string | null = null,
    message: string = '중복된 리소스가 존재합니다.',
  ) {
    super(message, reason);
  }
}

/* 500 에러 응답 */
export class InternalServerErrorResponseDto extends InternalServerErrorException {
  @ApiProperty({
    name: 'message',
    type: String,
    example: '서버 오류가 발생했습니다.',
  })
  declare message: string;

  constructor(
    reason: string | null = null,
    message: string = '서버 오류가 발생했습니다.',
  ) {
    super(message, reason);
  }
}
