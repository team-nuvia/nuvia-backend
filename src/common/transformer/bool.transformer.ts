import { isNil } from '@util/isNil';
import { ValueTransformer } from 'typeorm';

export const BoolTinyIntTransformer: ValueTransformer = {
  from: (value: number) => (isNil(value) ? null : !!value),
  to: (value: boolean) => (value ? 1 : 0),
};
