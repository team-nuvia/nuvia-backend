export const isNil = (
  value: undefined | null | unknown,
): value is undefined | null => value === undefined || value === null;
