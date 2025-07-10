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

  export interface IResponse<T extends any = any> {
    ok: boolean;
    httpStatus: HttpStatus;
    method: RequestMethod;
    path: string;
    timestamp: Date;
    payload: T | T[] | null;
    message: string | null;
    reason: string | null;
  }
}
export declare module 'express' {
  interface Request {
    user: LoginUserData;
    token: string | null;
  }
}
