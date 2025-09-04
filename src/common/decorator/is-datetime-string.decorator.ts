import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isDatetimeString', async: false })
export class IsDatetimeStringConstraint<T extends string> implements ValidatorConstraintInterface {
  validate(value: T, _args: ValidationArguments): boolean | Promise<boolean> {
    if (value === null || value === undefined) return true;
    if (typeof value !== 'string') return false;
    return /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|\+\d{2}:\d{2}))$/.test(value);
  }

  defaultMessage(_args: ValidationArguments) {
    return 'ISO8601 형식의 날짜 문자열이 필요합니다.';
  }
}

export function IsDatetimeString(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isDatetimeString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDatetimeStringConstraint,
    });
  };
}
