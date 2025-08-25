export function getRangeOfWeek(today: Date = new Date()) {
  const base = new Date(today);
  const year = base.getFullYear();
  const month = base.getMonth();
  const day = base.getDate();

  const startDate = new Date(year, month, day - (day % 7), 0, 0, 0, 0);
  const endDate = new Date(year, month, day - (day % 7) + 6, 23, 59, 59, 999);

  return { startDate, endDate };
}
