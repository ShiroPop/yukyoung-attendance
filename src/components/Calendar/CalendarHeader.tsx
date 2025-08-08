// src/components/Calendar/CalendarHeader.tsx
import styled from "styled-components";
import { useCalendarDateStore } from "../../store/calendarDate";

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

const CalendarHeader = () => {
  const { year, setYear, month, setMonth } = useCalendarDateStore();

  const handleMonth = (next: boolean) => {
    if (next) {
      if (month === 11) {
        setMonth(0);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
      }
    } else {
      if (month === 0) {
        setMonth(11);
        setYear(year - 1);
      } else {
        setMonth(month - 1);
      }
    }
  };

  return (
    <CalendarTop>
      <CalendarTopButton onClick={() => handleMonth(false)}>◀</CalendarTopButton>
      <CalendarTopFont>{year}년</CalendarTopFont>
      <CalendarTopFont>{month + 1}월</CalendarTopFont>
      <CalendarTopButton onClick={() => handleMonth(true)}>▶</CalendarTopButton>
    </CalendarTop>
  );
};

export default CalendarHeader;
