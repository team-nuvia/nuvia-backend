import { nanoid } from 'nanoid';

export const uniqueHash = (length: number = 64): string => {
  return nanoid(length);
};
