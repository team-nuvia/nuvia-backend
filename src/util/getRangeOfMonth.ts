/**
 * 현재 월의 이전 월, 현재 월의 첫 날, 현재 월의 마지막 날을 반환
 * @param year 년도
 * @param month 월
 * @returns { prevFirstDay: Date, prevLastDay: Date, currentFirstDay: Date, currentLastDay: Date } 이전 월의 첫 날, 이전 월의 마지막 날, 현재 월의 첫 날, 현재 월의 마지막 날
 */
export function getRangeOfMonth(year: number, month: number) {
  const prevFirstDay = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const prevLastDay = new Date(year, month, 0, 23, 59, 59, 999);
  const currentFirstDay = new Date(year, month, 1, 0, 0, 0, 0);
  const currentLastDay = new Date(year, month + 1, 0, 23, 59, 59, 999);

  return { prevFirstDay, prevLastDay, currentFirstDay, currentLastDay };
}
