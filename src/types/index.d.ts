import { HttpStatus } from '@nestjs/common';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';

export declare global {
  export type StringOrNull = string | null;
  export type TypeOrNull<T> = T | null;
  export type ValueOrEmpty<T> = T | null | undefined | unknown;

  export declare interface LoginUserData {
    id: number;
  }

  export declare interface UserMinimumInformation {
    id: number;
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
}
export declare module 'express' {
  interface Request {
    user: LoginUserData;
    token: string | null;
  }
}
