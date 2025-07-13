import { BadRequestException } from '@common/dto/response';
import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

export const InputValidationPipe = (options?: ValidationPipeOptions) => {
  return new ValidationPipe({
    ...options,
    transform: true,
    stopAtFirstError: true,
    exceptionFactory(errors) {
      const message = errors.shift();
      return new BadRequestException({
        reason: message?.property ?? ('{{param}}' as StringOrNull),
      });
    },
  });
};
