import { ApiDocs } from '@common/variable/dsl';
import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

export const InputValidationPipe = (options?: ValidationPipeOptions) => {
  return new ValidationPipe({
    ...options,
    transform: true,
    stopAtFirstError: true,
    exceptionFactory(errors) {
      console.log('🚀 ~ exceptionFactory ~ errors:', errors);
      const message = errors.shift();
      return new ApiDocs.DslBadRequest({
        cause: message?.property ?? '{{param}}',
      });
    },
  });
};
