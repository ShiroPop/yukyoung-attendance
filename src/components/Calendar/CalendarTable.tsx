import styled from "styled-components";
import CalendarCell from "./CalendarCell";
import { useCalendarMatrix } from "../../hooks/useCalendarMatrix";
import { useCalendarDateStore } from "../../store/calendarDate";

const Table = styled.table`
  width: 100%;
  max-width: 600px;
  margin: 4px auto 12px auto;
  border-collapse: collapse;
  table-layout: fixed;
`;

const ThPadding = styled.th`
  padding: 4px;
`;

const TdPadding = styled.td`
  text-align: center;
  padding: 4px;
`;

const Div = styled.div`
  display: flex;
  justify-content: center;
  min-width: 36px;
`;

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const CalendarTable = () => {
  const { year, month } = useCalendarDateStore();
  const dateArray = useCalendarMatrix(year, month);

  return (
    <Table>
      <thead>
        <tr>
          {weekDays.map((day, idx) => (
            <ThPadding key={idx}>
              <Div>{day}</Div>
            </ThPadding>
          ))}
        </tr>
      </thead>
      <tbody>
        {dateArray.map((week, i) => (
          <tr key={i}>
            {week.map((cell, idx) => (
              <TdPadding key={`${i}-${idx}`}>
                <CalendarCell day={cell.day} weekday={cell.weekday} isCurrentMonth={cell.currentMonth} />
              </TdPadding>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CalendarTable;
