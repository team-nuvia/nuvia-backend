export interface PaginatedResponseDto<T> {
  page: number;
  limit: number;
  total: number;
  data: T[];
}
