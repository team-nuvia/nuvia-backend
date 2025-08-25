import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';

export class IsDateOnlyStringConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments): boolean | Promise<boolean> {
    if (value === null || value === undefined) return true;
    if (typeof value !== 'string') return false;
    return /^(\d{4}-\d{2}-\d{2})$/.test(value);
  }

  defaultMessage(_args: ValidationArguments) {
    return 'YYYY-MM-DD 형식의 날짜 문자열이 필요합니다.';
  }
}

export function IsDateOnlyString(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isDateOnlyString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDateOnlyStringConstraint,
    });
  };
}
