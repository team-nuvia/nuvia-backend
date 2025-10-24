import { HttpStatus } from '@nestjs/common';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import { SocialProvider } from '@share/enums/social-provider.enum';
import jwt from 'jsonwebtoken';

export declare global {
  export type StringOrNull = string | string[] | null;
  export type TypeOrNull<T> = T | null;
  export type ValueOrEmpty<T> = T | null | undefined | unknown;

  export interface LoginUserData {
    id: number;
    provider: SocialProvider;
  }

  export interface SocialLoginGoogleIdToken {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
    id_token: string;
    refresh_token?: string;
  }

  export interface SocialLoginKakaoIdToken {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
    id_token: string;
    refresh_token: string;
  }

  export interface SocialLoginGoogleIdTokenPayload extends jwt.JwtPayload {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    at_hash: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    iat: number;
    exp: number;
  }

  export interface SocialLoginKakaoIdTokenPayload extends jwt.JwtPayload {
    iss: string;
    aud: string;
    sub: string;
    iat: number;
    exp: number;
    auth_time: number;
    nonce: string;
    nickname: string;
    picture: string;
    email: string;
  }

  export interface UserMinimumInformation {
    id: number;
    provider: SocialProvider;
    email: string;
    name: string;
    nickname: string;
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

  export interface ICreateQuestionOption {
    label: string;
    sequence: number;
  }

  export interface ICreateQuestionAndOption {
    surveyId: number;
    title: string;
    description: string | null;
    questionType: QuestionType;
    dataType: DataType;
    isRequired: boolean;
    sequence: number;
    questionOptions: ICreateQuestionOption[];
  }

  export interface IUpdateQuestion {
    id: number;
    surveyId: number;
    title: string;
    description: string | null;
    questionType: QuestionType;
    dataType: DataType;
    isRequired: boolean;
    sequence: number;
  }

  export interface IUpdateQuestionOption {
    id: number;
    questionId: number;
    label: string;
    sequence: number;
  }

  type IpAddress =
    | '::1'
    | `${number}.x.x.x`
    | `${number}.${number}.x.x`
    | `${number}.${number}.${number}.x`
    | `${number}.${number}.${number}.${number}`;
}
export declare module 'express' {
  interface Request {
    user: LoginUserData;
    token: string | null;
    realIp: IpAddress;
  }
}
