import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isTruthy', async: false })
export class IsTruthyConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return value === true;
  }
}

export function IsTruthy(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string | symbol) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      constraints: [],
      validator: IsTruthyConstraint,
    });
  };
}
