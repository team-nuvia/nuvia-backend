/* 인풋 형태 */
export const InputType = {
  ShortText: 'shortText',
  LongText: 'longText',
  SingleChoice: 'singleChoice',
  MultipleChoice: 'multipleChoice',
} as const;
export type InputType = (typeof InputType)[keyof typeof InputType];

/* 데이터 타입 */
export const DataType = {
  Text: 'text',
  Email: 'email',
  Link: 'link',
  Date: 'date',
  DateTime: 'dateTime',
  Time: 'time',
  Image: 'image',
  Video: 'video',
  File: 'file',
  Location: 'location',
  Rating: 'rating',
} as const;
export type DataType = (typeof DataType)[keyof typeof DataType];

export const QuestionType = {
  InputType,
  DataType,
} as const;
export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];
