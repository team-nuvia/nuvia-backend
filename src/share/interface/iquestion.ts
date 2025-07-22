import { DataType, InputType, QuestionType } from '@share/enums/question-type';

export interface IQuestionOption {
  id: number;
  label: string;
}

export abstract class IQuestion {
  id!: number;
  title!: string;
  description!: string;
  questionType!: InputType;
  dataType!: DataType;
  required!: boolean;
  options: IQuestionOption[] = [];
  answers: Map<number, string> = new Map();
  isAnswered?: boolean = false;

  constructor(
    title: string,
    questionType: InputType,
    dataType: DataType,
    required: boolean = true,
    options?: IQuestionOption[],
  ) {
    this.title = title;
    this.questionType = questionType;
    this.dataType = dataType;
    this.required = required;
    if (options) this.options = options;
  }
}

export class IQuestionShortText extends IQuestion {
  questionType = QuestionType.InputType.ShortText;
}

export class IQuestionLongText extends IQuestion {
  questionType = QuestionType.InputType.LongText;
}

export class IQuestionSingleChoice extends IQuestion {
  questionType = QuestionType.InputType.SingleChoice;
}

export class IQuestionMultipleChoice extends IQuestion {
  questionType = QuestionType.InputType.MultipleChoice;
}

export type AllQuestion =
  | IQuestion
  | IQuestionShortText
  | IQuestionLongText
  | IQuestionSingleChoice
  | IQuestionMultipleChoice;
