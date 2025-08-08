import { useMemo } from "react";

interface CalendarCell {
  day: number;
  currentMonth: boolean;
  weekday: number; // 0 (일) ~ 6 (토)
}

export const useCalendarMatrix = (year: number, month: number): CalendarCell[][] => {
  return useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    // 이전 달 날짜 (앞쪽 공백 채우기)
    const prevMonthDates = Array.from({ length: firstDayOfMonth }, (_, i) => {
      const day = daysInPreviousMonth - firstDayOfMonth + i + 1;
      const date = new Date(year, month - 1, day);
      return {
        day,
        currentMonth: false,
        weekday: date.getDay(),
      };
    });

    // 이번 달 날짜
    const currentMonthDates = Array.from({ length: daysInCurrentMonth }, (_, i) => {
      const day = i + 1;
      const date = new Date(year, month, day);
      return {
        day,
        currentMonth: true,
        weekday: date.getDay(),
      };
    });

    const allDates = [...prevMonthDates, ...currentMonthDates];

    // 다음 달 날짜 (마지막 주 채우기용)
    const nextDaysCount = (7 - (allDates.length % 7)) % 7;
    const nextMonthDates = Array.from({ length: nextDaysCount }, (_, i) => {
      const day = i + 1;
      const date = new Date(year, month + 1, day);
      return {
        day,
        currentMonth: false,
        weekday: date.getDay(),
      };
    });

    const fullDates = [...allDates, ...nextMonthDates];

    // 주 단위로 나누기
    const weeks: CalendarCell[][] = [];
    for (let i = 0; i < fullDates.length; i += 7) {
      weeks.push(fullDates.slice(i, i + 7));
    }

    return weeks;
  }, [year, month]);
};
