import { HttpStatus } from '@nestjs/common';

export const ErrorKey = {
  /* Default Error */
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  PRECONDITION_FAILED: 'PRECONDITION_FAILED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',

  /* Custom Error */
  NOT_FOUND_USER: 'NOT_FOUND_USER',
  NOT_FOUND_EMAIL: 'NOT_FOUND_EMAIL',
} as const;
export type ErrorKey = (typeof ErrorKey)[keyof typeof ErrorKey];

export const ErrorCode = {
  BAD_REQUEST: HttpStatus.BAD_REQUEST,
  UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
  FORBIDDEN: HttpStatus.FORBIDDEN,
  NOT_FOUND: HttpStatus.NOT_FOUND,
  CONFLICT: HttpStatus.CONFLICT,
  PRECONDITION_FAILED: HttpStatus.PRECONDITION_FAILED,
  TOO_MANY_REQUESTS: HttpStatus.TOO_MANY_REQUESTS,
  INTERNAL_SERVER_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
  SERVICE_UNAVAILABLE: HttpStatus.SERVICE_UNAVAILABLE,

  NOT_FOUND_USER: HttpStatus.NOT_FOUND,
  NOT_FOUND_EMAIL: HttpStatus.NOT_FOUND,
} as const;
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export const ErrorMessage = {
  BAD_REQUEST: '잘못된 요청입니다.',
  UNAUTHORIZED: '인증되지 않은 요청입니다.',
  FORBIDDEN: '권한이 없는 요청입니다.',
  NOT_FOUND: '존재하지 않는 요청입니다.',
  CONFLICT: '중복된 요청입니다.',
  PRECONDITION_FAILED: '사전 조건이 충족되지 않은 요청입니다.',
  TOO_MANY_REQUESTS: '요청이 너무 많습니다.',
  INTERNAL_SERVER_ERROR: '서버 오류가 발생했습니다.',
  SERVICE_UNAVAILABLE: '서비스를 사용할 수 없습니다.',

  NOT_FOUND_USER: '존재하지 않는 사용자입니다.',
  NOT_FOUND_EMAIL: '존재하지 않는 이메일입니다.',
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
