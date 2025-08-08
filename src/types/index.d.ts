import { UserRole } from '@common/variable/enums';
import { HttpStatus } from '@nestjs/common';

export declare global {
  export type StringOrNull = string | null;
  export type TypeOrNull<T> = T | null;
  export type ValueOrEmpty<T> = T | null | undefined | unknown;

  export declare interface LoginUserData {
    id: number;
    email: string;
    name: string;
    // nickname: string;
    role: UserRole;
  }

  export interface IBaseResponse<T> {
    ok: boolean;
    httpStatus: HttpStatus;
    name: string;
    message: StringOrNull;
    reason: StringOrNull;
    payload: TypeOrNull<T>;
  }

  export interface CustomApiPropertyOptions<T> {
    value: any;
    type?: T;
    description?: string;
    enum?: any;
    required?: boolean;
    nullable?: boolean;
  }
}
export declare module 'express' {
  interface Request {
    user: LoginUserData;
    token: string | null;
  }
}
