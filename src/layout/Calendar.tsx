import { useEffect, useMemo, useState } from "react";
import { fetchCollection } from "../utils/firestore";
import styled from "styled-components";
import { useAttendanceDatesStore } from "../store/attendanceDatesStore";
import { useDateStore } from "../store/dateStore";
import { usePopupStore } from "../store/popupStore";

interface date {
  day: number;
  currentMonth: boolean;
}

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

const Label = styled.label<{ hasData?: boolean }>`
  display: inline-block;
  border-radius: 50%;
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  line-height: 120%;
  color: #000;
  cursor: pointer;

  div {
    background-color: ${({ hasData }) => (hasData ? "" : "#E2E2E2")};
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

const Cell = styled.div<{ isCurrent: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4px auto;
  color: ${({ isCurrent }) => (isCurrent ? "#000" : "#CECECE")};
  font-size: 18px;
  font-weight: 400;
  line-height: 120%;
  width: 36px;
  height: 36px;
  border-radius: 99px;
  cursor: pointer;
`;

//
// firebase db 조인해서 가져오기
// 클래스 바 구현 후, join한 date 값을 가지고 cell css 수정하기
// 최종적으로 나온 cell 디자인을 보고 table min width 주기 (원이 겹치지 않는 사이즈)
// 데이터 캐싱 관련해서 react query 고민해보기
// 달력함수 useMemo 고려해보기
//

const Calendar = () => {
  const { dates } = useAttendanceDatesStore();
  const { date, setDate } = useDateStore();
  const { openPopup } = usePopupStore();

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

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

  const hasAttendance = (day: number): boolean => {
    const paddedMonth = String(month + 1).padStart(2, "0");
    const paddedDay = String(day).padStart(2, "0");
    const dateStr = `${year}-${paddedMonth}-${paddedDay}`;
    return dates.some((d) => d.id === dateStr);
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
    <>
      <div onClick={() => handleMonth(false)}>pre</div>
      <div>{year}년</div>
      <div>{month + 1}월</div>
      <div onClick={() => handleMonth(true)}>next</div>
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
                    <Label hasData={cell.currentMonth && hasAttendance(cell.day)}>
                      <DateInput
                        type="radio"
                        name="date"
                        value={new Date(year, month, cell.day + 1).toISOString().substring(0, 10)}
                        onClick={() => {
                          handleDateClick(new Date(year, month, cell.day + 1).toISOString().substring(0, 10));
                        }}
                      />
                      <Cell isCurrent={cell.currentMonth}>{cell.day}</Cell>
                    </Label>
                  ) : (
                    <Cell isCurrent={cell.currentMonth}>{cell.day}</Cell>
                  )}
                </TablePadding>
              ))}
            </tr>
          ))}
        </tbody>
      </CalendarTable>
    </>
  );
};

export default Calendar;
