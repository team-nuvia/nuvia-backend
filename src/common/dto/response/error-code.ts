import { HttpStatus } from '@nestjs/common';

export const ErrorKey = {
  /* Default Error */
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  CONFLICT: 'CONFLICT',
  PRECONDITION_FAILED: 'PRECONDITION_FAILED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',

  /* Custom Error */
  NOT_FOUND_USER: 'NOT_FOUND_USER',
  NOT_FOUND_EMAIL: 'NOT_FOUND_EMAIL',
  ALREADY_EXISTS_USER: 'ALREADY_EXISTS_USER',
  ALREADY_EXISTS_EMAIL: 'ALREADY_EXISTS_EMAIL',
  NO_MATCH_USER_INFORMATION: 'NO_MATCH_USER_INFORMATION',
  NOT_FOUND_PROFILE: 'NOT_FOUND_PROFILE',
  INVALID_INPUT_VALUE: 'INVALID_INPUT_VALUE',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  VERIFY_TOKEN_SUCCESS: 'VERIFY_TOKEN_SUCCESS',
} as const;
export type ErrorKey = (typeof ErrorKey)[keyof typeof ErrorKey];

export const ErrorCode = {
  BAD_REQUEST: HttpStatus.BAD_REQUEST,
  UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
  FORBIDDEN: HttpStatus.FORBIDDEN,
  NOT_FOUND: HttpStatus.NOT_FOUND,
  METHOD_NOT_ALLOWED: HttpStatus.METHOD_NOT_ALLOWED,
  CONFLICT: HttpStatus.CONFLICT,
  PRECONDITION_FAILED: HttpStatus.PRECONDITION_FAILED,
  TOO_MANY_REQUESTS: HttpStatus.TOO_MANY_REQUESTS,
  INTERNAL_SERVER_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
  SERVICE_UNAVAILABLE: HttpStatus.SERVICE_UNAVAILABLE,

  NOT_FOUND_USER: HttpStatus.NOT_FOUND,
  NOT_FOUND_EMAIL: HttpStatus.NOT_FOUND,
  ALREADY_EXISTS_USER: HttpStatus.CONFLICT,
  ALREADY_EXISTS_EMAIL: HttpStatus.CONFLICT,
  NO_MATCH_USER_INFORMATION: HttpStatus.BAD_REQUEST,
  NOT_FOUND_PROFILE: HttpStatus.NOT_FOUND,
  INVALID_INPUT_VALUE: HttpStatus.BAD_REQUEST,
  LOGIN_SUCCESS: HttpStatus.OK,
  VERIFY_TOKEN_SUCCESS: HttpStatus.OK,
} as const;
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export const ErrorMessage = {
  BAD_REQUEST: '잘못된 요청입니다.',
  UNAUTHORIZED: '인증되지 않은 요청입니다.',
  FORBIDDEN: '권한이 없는 요청입니다.',
  NOT_FOUND: '존재하지 않는 요청입니다.',
  METHOD_NOT_ALLOWED: '허용되지 않은 요청입니다.',
  CONFLICT: '중복된 요청입니다.',
  PRECONDITION_FAILED: '사전 조건이 충족되지 않은 요청입니다.',
  TOO_MANY_REQUESTS: '요청이 너무 많습니다.',
  INTERNAL_SERVER_ERROR: '서버 오류가 발생했습니다.',
  SERVICE_UNAVAILABLE: '서비스를 사용할 수 없습니다.',

  NOT_FOUND_USER: '존재하지 않는 사용자입니다.',
  NOT_FOUND_EMAIL: '존재하지 않는 이메일입니다.',
  ALREADY_EXISTS_USER: '이미 존재하는 사용자입니다.',
  ALREADY_EXISTS_EMAIL: '이미 존재하는 이메일입니다.',
  NO_MATCH_USER_INFORMATION: '사용자 정보가 일치하지 않습니다.',
  NOT_FOUND_PROFILE: '프로필을 찾지 못했습니다.',
  INVALID_INPUT_VALUE: '입력값이 올바르지 않습니다.',
  LOGIN_SUCCESS: '로그인 성공',
  VERIFY_TOKEN_SUCCESS: '토큰 검증 성공',
} as const;
export type ErrorMessage = (typeof ErrorMessage)[keyof typeof ErrorMessage];

type ErrorReturn = {
  message: string;
  status: HttpStatus;
  errorCode: ErrorCode;
};

export function getErrorMessage(errorKey: keyof typeof ErrorKey): ErrorReturn {
  const message = ErrorMessage[errorKey] ?? '알 수 없는 오류가 발생했습니다.';
  const status = ErrorCode[errorKey] ?? ErrorCode.INTERNAL_SERVER_ERROR;
  const errorCode = ErrorCode[errorKey] ?? ErrorCode.INTERNAL_SERVER_ERROR;

  return { message, status, errorCode };
}
