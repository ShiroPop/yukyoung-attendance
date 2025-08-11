import { useEffect, useRef, useState } from "react";
import { useCalendarHeightStore } from "../store/calendarHeightStore";
import CalendarHeader from "../components/Calendar/CalendarHeader";
import CalendarTable from "../components/Calendar/CalendarTable";
import styled from "styled-components";

const CalendarWrapper = styled.div<{ $isShrunk: boolean }>`
  overflow: hidden;
  max-height: ${({ $isShrunk }) => ($isShrunk ? "100px" : "500px")};
  transition: max-height 0.5s ease;
`;

const Calendar = () => {
  const { setCalendarHeight, isChildListShrunk } = useCalendarHeightStore();

  const calendarRef = useRef<HTMLDivElement>(null);

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

  return (
    <CalendarWrapper ref={calendarRef} $isShrunk={isChildListShrunk}>
      <CalendarHeader />
      <CalendarTable />
    </CalendarWrapper>
  );
};

export default Calendar;
