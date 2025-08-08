// 날짜 포맷 변환

export const formatDate = (year: number, month: number, day: number): string => {
  const y = year;
  const m = String(month + 1).padStart(2, "0"); // JS는 0-based month
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
