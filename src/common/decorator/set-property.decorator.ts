import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export const SetProperty = <T>(options: CustomApiPropertyOptions<T>) => {
  const defaultOptions: ApiPropertyOptions = {
    description: options?.description,
    type: options.type ?? (typeof options.value === 'function' ? options.value : typeof options.value),
    isArray: Array.isArray(options.value),
    example: typeof options.value === 'function' ? new options.value() : options.value,
    enum: options?.enum,
    required: options?.required ?? true,
    nullable: options?.nullable ?? false,
  };
  return applyDecorators(ApiProperty(defaultOptions as ApiPropertyOptions));
};
