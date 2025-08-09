import { DataType } from "@share/enums/data-type";
import { QuestionType } from "@share/enums/question-type";

export class QuestionOptionDetailNestedResponseDto {
  id!: number;
  label!: string;
}

export class QuestionDetailNestedResponseDto {
  id!: number;
  title!: string;
  description!: string | null;
  isRequired!: boolean;
  questionType!: QuestionType;
  dataType!: DataType;
  options!: QuestionOptionDetailNestedResponseDto[];
}
