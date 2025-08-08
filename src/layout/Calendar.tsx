import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useDateStore } from "../store/dateStore";
import { useModalStore } from "../store/modalStore";
import { useHolidayQuery } from "../api/useQuery";
import { useCalendarHeightStore } from "../store/calendarHeightStore";
import { useAttendanceQueries } from "../api/useAttendanceQueries";
import { useUserStore } from "../store/userStore";
import { useClassesStore } from "../store/classesStore";

const CalendarTop = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  color: #76c078;
  border-top: 1px solid #00000030;
  border-bottom: 1px solid #00000030;
  margin: 0 0 10px 0;
`;

const CalendarTopButton = styled.div`
  cursor: pointer;
`;

const CalendarTopFont = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin: 8px 0;
  cursor: default;
`;

const CalendarTable = styled.table`
  width: 100%;
  max-width: 600px;
  margin: 4px auto 12px auto;
  border-collapse: collapse;
  table-layout: fixed;
`;

const ThPadding = styled.th`
  padding: 4px;
`;

const Div = styled.div`
  display: flex;
  justify-content: center;
  min-width: 36px;
`;

const TablePadding = styled.td`
  text-align: center;
  padding: 4px;
`;

const DateInput = styled.input.attrs({ type: "radio" })`
  display: none;
`;

const Label = styled.label<{ $hasData?: string }>`
  position: relative;
  display: inline-block;
  border-radius: 50%;
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  line-height: 120%;
  color: #000;
  cursor: pointer;

  div {
    background-color: ${({ $hasData }) => $hasData};
    transition: background-color 0.5s, color 0.2s;
    border-radius: 50%;
  }

  input:checked + div {
    background-color: #76c078;
    color: #fff;
  }

  input:checked + div span {
    background-color: #76c078;
    color: #fff;
  }

  div:hover {
    background-color: #76c0784d;
  }
`;

const Cell = styled.div<{ $isCurrent: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4px auto;
  color: ${({ $isCurrent }) => ($isCurrent ? "#000" : "#CECECE")};
  font-size: 18px;
  font-weight: 400;
  line-height: 120%;
  width: 36px;
  height: 36px;
  border-radius: 99px;
  cursor: pointer;
`;

const Small = styled.span<{ $hasData?: string }>`
  position: absolute;
  right: -5px;
  bottom: -1px;
  width: 20px;
  height: 20px;
  border-radius: 99px;
  font-size: 10px;
  background-color: ${({ $hasData }) => $hasData};
`;

const Calendar = () => {
  const { data: holidayDates } = useHolidayQuery();
  const attendanceQueries = useAttendanceQueries();

  const { date, setDate } = useDateStore();
  const { openModal } = useModalStore();
  const { setCalendarHeight } = useCalendarHeightStore();
  const { user } = useUserStore();
  const { classId } = useClassesStore();

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  const calendarRef = useRef<HTMLDivElement>(null);

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const attendanceMap = useMemo(() => {
    const map = new Map<string, number>();
    attendanceQueries.forEach((query) => {
      if (query.isSuccess && query.data?.dateId) {
        map.set(query.data.dateId, query.data.data.length);
      }
    });
    return map;
  }, [attendanceQueries]);

  const dateArray = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    const prevMonthDates = Array.from({ length: firstDay }, (_, i) => {
      const day = daysInPreviousMonth - firstDay + i + 1;
      const date = new Date(year, month - 1, day);
      return { day, currentMonth: false, weekday: date.getDay() };
    });

    const currentMonthDates = Array.from({ length: daysInCurrentMonth }, (_, i) => {
      const day = i + 1;
      const date = new Date(year, month, day);
      return { day, currentMonth: true, weekday: date.getDay() };
    });

    const allDates = [...prevMonthDates, ...currentMonthDates];
    const nextDaysCount = (7 - (allDates.length % 7)) % 7;

    const nextMonthDates = Array.from({ length: nextDaysCount }, (_, i) => {
      const day = i + 1;
      const date = new Date(year, month + 1, day);
      return { day, currentMonth: false, weekday: date.getDay() };
    });

    const fullDates = [...allDates, ...nextMonthDates];

    const weeks = [];
    for (let i = 0; i < fullDates.length; i += 7) {
      weeks.push(fullDates.slice(i, i + 7));
    }

    return weeks;
  }, [year, month]);

  useEffect(() => {
    const updateHeight = () => {
      if (calendarRef.current) {
        setCalendarHeight(calendarRef.current.offsetHeight);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    if (calendarRef.current) {
      resizeObserver.observe(calendarRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [setCalendarHeight]);

  const getAttendanceColor = (day: number, weekday: number, isCurrentMonth: boolean): string => {
    if (!isCurrentMonth) return "#E2E2E2";
    const paddedMonth = String(month + 1).padStart(2, "0");
    const paddedDay = String(day).padStart(2, "0");
    const dateStr = `${year}-${paddedMonth}-${paddedDay}`;

    let isAttendance = false;

    if (classId.id === "all") {
      isAttendance = attendanceQueries.some((query) => query.data?.dateId === dateStr && query.data?.data?.length > 0);
    } else {
      const attendanceForDateList = attendanceQueries.filter((query) =>
        query.data?.data.some((q) => q.class_id === classId.id)
      );

      isAttendance =
        attendanceForDateList.some(
          (query) =>
            query.data?.dateId === dateStr &&
            query.data?.data?.length > 0 &&
            query.data?.data?.some((record: { class_id: string }) => user?.assigned_classes.includes(record.class_id))
        ) ?? false;
    }

    const isHoliday = holidayDates?.some((d) => d.id === dateStr) ?? false;

    const isWeekend = weekday === 0 || weekday === 6;

    if (isWeekend) return "#FF9696";
    if (isAttendance && isHoliday) return "#FFB37D";
    if (isAttendance) return "none";
    if (isHoliday) return "#FF9696";
    return "#E2E2E2";
  };

  const handleMonth = (next: boolean) => {
    if (next) {
      if (month === 11) {
        setMonth(0);
        setYear((prev) => prev + 1);
      } else {
        setMonth((prev) => prev + 1);
      }
    } else {
      if (month === 0) {
        setMonth(11);
        setYear((prev) => prev - 1);
      } else {
        setMonth((prev) => prev - 1);
      }
    }
  };

  const formatDate = (year: number, month: number, day: number) => {
    const y = year;
    const m = String(month + 1).padStart(2, "0"); // month는 0-based
    const d = String(day).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  return (
    <div ref={calendarRef}>
      <CalendarTop>
        <CalendarTopButton onClick={() => handleMonth(false)}>◀</CalendarTopButton>
        <CalendarTopFont>{year}년</CalendarTopFont>
        <CalendarTopFont>{month + 1}월</CalendarTopFont>
        <CalendarTopButton onClick={() => handleMonth(true)}>▶</CalendarTopButton>
      </CalendarTop>
      <CalendarTable>
        <thead>
          <tr>
            {weekDays.map((ele, idx) => (
              <ThPadding key={idx}>
                <Div>{ele}</Div>
              </ThPadding>
            ))}
          </tr>
        </thead>
        <tbody>
          {dateArray.map((week, i) => (
            <tr key={i}>
              {week.map((cell, idx) => (
                <TablePadding key={`${i}` + idx}>
                  {cell.currentMonth ? (
                    <Label
                      $hasData={cell.currentMonth && getAttendanceColor(cell.day, cell.weekday, cell.currentMonth)}
                    >
                      <DateInput
                        type="radio"
                        name="date"
                        checked={date === formatDate(year, month, cell.day)}
                        value={formatDate(year, month, cell.day)}
                        onChange={() => {
                          setDate(formatDate(year, month, cell.day));
                        }}
                        onClick={() => date === formatDate(year, month, cell.day) && openModal()}
                        disabled={cell.weekday === 0 || cell.weekday === 6}
                      />
                      <Cell $isCurrent={cell.currentMonth}>
                        {cell.day}
                        {user?.role === "admin" && attendanceMap.get(formatDate(year, month, cell.day)) ? (
                          <Small
                            $hasData={
                              cell.currentMonth && getAttendanceColor(cell.day, cell.weekday, cell.currentMonth)
                            }
                          >
                            {attendanceMap.get(formatDate(year, month, cell.day))}
                          </Small>
                        ) : (
                          <></>
                        )}
                      </Cell>
                    </Label>
                  ) : (
                    <Cell $isCurrent={cell.currentMonth}>{cell.day}</Cell>
                  )}
                </TablePadding>
              ))}
            </tr>
          ))}
        </tbody>
      </CalendarTable>
    </div>
  );
};

export default Calendar;
