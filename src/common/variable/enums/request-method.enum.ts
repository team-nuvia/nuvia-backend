export const RequestMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
} as const;
export type RequestMethod = (typeof RequestMethod)[keyof typeof RequestMethod];
