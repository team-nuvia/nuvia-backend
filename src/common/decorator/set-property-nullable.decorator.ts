import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional, ApiPropertyOptions } from '@nestjs/swagger';

export const SetPropertyNullable = (options: CustomApiPropertyOptions) => {
  const defaultOptions = {
    description: options.description,
    type: options.value ? (typeof options.value === 'function' ? options.value : typeof options.value) : String,
    isArray: Array.isArray(options.value),
    example: options.value,
    enum: options?.enum,
    required: false,
    nullable: true,
  };
  return applyDecorators(ApiPropertyOptional(defaultOptions as ApiPropertyOptions));
};
