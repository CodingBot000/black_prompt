export function toDateOnlyISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDaysISO(dateISO: string, days: number): string {
  const date = new Date(`${dateISO}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toDateOnlyISO(date);
}

export function createStartDate(baseDate: Date): string {
  const startYear = baseDate.getFullYear() + 3;
  return `${startYear}-01-01`;
}

export function formatKoreanDate(dateISO: string): string {
  const date = new Date(`${dateISO}T00:00:00.000Z`);
  return `${date.getUTCFullYear()}년 ${date.getUTCMonth() + 1}월 ${date.getUTCDate()}일`;
}
