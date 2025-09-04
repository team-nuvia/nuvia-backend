import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isEnumString', async: false })
class IsEnumStringConstraint<T extends Record<string, any>> implements ValidatorConstraintInterface {
  validate(value: T[keyof T], args: ValidationArguments) {
    console.log('🚀 ~ IsEnumStringConstraint ~ validate ~ value:', value);
    const [enumType] = args.constraints;
    const valueList = value.split(',');
    return valueList.every((v: string) => Object.values(enumType).includes(v));
  }
}

export function IsEnumString<T>(enumType: T, validationOptions?: ValidationOptions): PropertyDecorator {
  return (object: any, propertyName: string | symbol) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      constraints: [enumType],
      validator: IsEnumStringConstraint,
    });
  };
}
