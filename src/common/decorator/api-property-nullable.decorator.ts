import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional, ApiPropertyOptions } from '@nestjs/swagger';

export const ApiPropertyNullable = (options: ApiPropertyOptions) =>
  applyDecorators(
    ApiPropertyOptional({
      ...options,
      nullable: true,
    }),
  );
