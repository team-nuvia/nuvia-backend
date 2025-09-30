import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isDifferentFrom', async: false })
export class IsDifferentFromConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [property] = args.constraints as [string];
    const object = args.object as Record<string, string>;

    if (property in object) {
      const objectValue = object[property];
      return value !== objectValue;
    }

    return false;
  }
}

export function IsDifferentFrom(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string | symbol) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      constraints: [property],
      validator: IsDifferentFromConstraint,
    });
  };
}
