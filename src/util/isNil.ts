export const isNil = <T>(value: ValueOrEmpty<T>): value is null | undefined =>
  value === null || value === undefined;
