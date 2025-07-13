import { isNil } from './isNil';

export const isEmpty = <T>(
  value: ValueOrEmpty<T>,
): value is null | undefined => {
  return isNil(value) || value === '' || value === false || value === 0;
};
