import { RequestMethod, UserRole } from '@common/variable/enums';
import { HttpStatus } from '@nestjs/common';

export declare global {
  export declare interface LoginUserData {
    id: number;
    email: string;
    username: string;
    nickname: string;
    role: UserRole;
  }

  export interface DefaultResponseData {
    ok?: boolean;
    httpStatus?: HttpStatus;
    method?: RequestMethod;
    path?: string;
    timestamp?: Date;
  }

  export interface CommonResponseData<T extends any = any>
    extends DefaultResponseData {
    message?: string;
    payload?: T | null;
  }

  // export interface CommonResponseData<T extends any>
  //   extends DefaultResponseData {
  //   payload: T;
  // }

  export interface WithMessageCommonResponseData<T extends any>
    extends CommonResponseData {
    reason?: string | null;
  }

  export interface WithMessageResponseData extends DefaultResponseData {
    message?: string;
    reason?: string | null;
  }

  export type ApiMetadata = Pick<
    DefaultResponseData,
    'httpStatus' | 'method' | 'path' | 'description' | 'message' | 'reason'
  >;

  export type ResponseArgs<T> = Omit<
    WithMessageCommonResponseData<T>,
    keyof DefaultResponseData
  >;

  // export interface ApiMetadata {
  //   status: HttpStatus;
  //   method: RequestMethod;
  //   path: string;
  //   description: string;
  //   message: string;
  //   cause: string | null;
  // }
}

export declare module 'express' {
  interface Request {
    user: LoginUserData;
    token: string | null;
  }
}
