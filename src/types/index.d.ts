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
    path?: string;
    status?: HttpStatus;
    method?: RequestMethod;
    timestamp?: Date;
  }

  export interface CommonResponseData<T extends any>
    extends DefaultResponseData {
    payload: T;
  }

  export interface CommonResponseData<T extends any>
    extends DefaultResponseData {
    payload: T;
  }

  export interface WithMessageCommonResponseData<T extends any>
    extends DefaultResponseData {
    message?: string | null;
    payload: T | null;
  }

  export interface WithMessageResponseData extends DefaultResponseData {
    message?: string;
    cause?: string;
  }

  export interface ApiMetadata {
    status: HttpStatus;
    method: RequestMethod;
    path: string;
    description: string;
    message?: string;
    cause?: string;
  }
}

export declare module 'express' {
  interface Request {
    user: LoginUserData;
    token: string | null;
  }
}
