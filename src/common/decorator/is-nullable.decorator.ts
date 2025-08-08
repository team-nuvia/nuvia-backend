import { applyDecorators } from '@nestjs/common';
import { IsOptional, ValidateIf } from 'class-validator';

export const IsNullable = () =>
  applyDecorators(
    ValidateIf((_object, value) => value !== null),
    IsOptional(),
  );
