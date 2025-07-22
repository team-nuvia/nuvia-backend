import { InvalidInputValueException } from '@common/dto/exception/invalid-input-value.exception.dto';
import { ArgumentMetadata, Injectable, PipeTransform, ValidationError, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

/* 입력값 검증 파이프 */
@Injectable()
export class InputValidationPipeConstraints extends ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return super.transform(value, metadata);
  }

  getChildrenConstraints(errors: ValidationError[], constraints: any = {}, namespace: string[] = []): { constraints: any; namespace: string[] } {
    if (errors[0]?.constraints) {
      constraints = { ...constraints, ...errors[0]?.constraints };
    }

    if (errors[0]?.property) {
      namespace.push(errors[0].property);
    }

    if (errors[0]?.children) {
      return this.getChildrenConstraints(errors[0]?.children, constraints, namespace);
    }

    return { constraints, namespace };
  }

  /* 검증 예외 처리 커스텀 */
  exceptionFactory = (errors: ValidationError[]) => {
    console.log('🚀 ~ InputValidationPipe ~ errors:', errors[0]);
    const { constraints, namespace } = this.getChildrenConstraints(errors);

    const values = Object.values(constraints);
    if (values.length > 1) {
      return new InvalidInputValueException([namespace.join('.'), values].join('.'));
    }
    return new InvalidInputValueException(namespace.join('.'));
  };
  // /* 검증 예외 처리 커스텀 */
  // exceptionFactory = (errors: ValidationError[]) => {
  //   console.log('🚀 ~ InputValidationPipe ~ errors:', errors);
  //   const values = Object.values(errors[0].constraints ?? {});
  //   if (values.length > 1) {
  //     return new BadRequestException({
  //       reason: [errors[0].property, values].join('.'),
  //     });
  //   }
  //   return new BadRequestException({
  //     reason: errors[0].property,
  //   });
  // };
}

export const InputValidationPipe = (options?: ValidationPipeOptions) => {
  return new InputValidationPipeConstraints({
    ...options,
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    stopAtFirstError: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  });
};
