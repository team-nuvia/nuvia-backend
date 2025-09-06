import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isPastThanNow', async: false })
export class IsPastThanNowConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return value < new Date();
  }

  defaultMessage() {
    return `만료 일시는 최소 오늘보다 이후여야 합니다`;
  }
}

export function IsPastThanNow(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string | symbol) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      constraints: [],
      validator: IsPastThanNowConstraint,
    });
  };
}
