import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useDateStore } from "../store/dateStore";
import { usePopupStore } from "../store/popupStore";
import { useAttendanceDatesQuery, useHolidayQuery } from "../api/useQuery";
import { useCalendarHeightStore } from "../store/calendarHeightStore";
import { useAuth } from "../hooks/useAuth";

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

const Calendar = () => {
  const { data: attendanceDates } = useAttendanceDatesQuery();
  const { data: holidayDates } = useHolidayQuery();
  const { date, setDate } = useDateStore();
  const { openPopup } = usePopupStore();
  const { setCalendarHeight } = useCalendarHeightStore();
  const { logout } = useAuth();

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  const calendarRef = useRef<HTMLDivElement>(null);

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const dateArray = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    const prevMonthDates = Array.from({ length: firstDay }, (_, i) => ({
      day: daysInPreviousMonth - firstDay + i + 1,
      currentMonth: false,
    }));

    const currentMonthDates = Array.from({ length: daysInCurrentMonth }, (_, i) => ({
      day: i + 1,
      currentMonth: true,
    }));

    const allDates = [...prevMonthDates, ...currentMonthDates];
    const nextDaysCount = (7 - (allDates.length % 7)) % 7;

    const nextMonthDates = Array.from({ length: nextDaysCount }, (_, i) => ({
      day: i + 1,
      currentMonth: false,
    }));

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

  const getAttendanceColor = (day: number): string => {
    const paddedMonth = String(month + 1).padStart(2, "0");
    const paddedDay = String(day).padStart(2, "0");
    const dateStr = `${year}-${paddedMonth}-${paddedDay}`;

    const isAttendance = attendanceDates?.some((d) => d.id === dateStr) ?? false;
    const isHoliday = holidayDates?.some((d) => d.id === dateStr) ?? false;

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

  const handleDateClick = (dateStr: string) => {
    if (date === dateStr) {
      openPopup();
    } else {
      setDate(dateStr);
    }
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
                    <Label $hasData={cell.currentMonth && getAttendanceColor(cell.day)}>
                      <DateInput
                        type="radio"
                        name="date"
                        value={new Date(year, month, cell.day + 1).toISOString().substring(0, 10)}
                        onClick={() => {
                          handleDateClick(new Date(year, month, cell.day + 1).toISOString().substring(0, 10));
                        }}
                      />
                      <Cell $isCurrent={cell.currentMonth}>{cell.day}</Cell>
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
