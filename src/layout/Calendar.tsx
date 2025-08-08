import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useCalendarHeightStore } from "../store/calendarHeightStore";
import { useAttendanceQueries } from "../hooks/useAttendanceQueries";
import { formatDate } from "../utils/formatDate";
import { useCalendarMatrix } from "../hooks/useCalendarMatrix";
import CalendarCell from "../components/Calendar/CalendarCell";
import { useAttendanceMap } from "../hooks/useAttendanceMap";
import CalendarHeader from "../components/Calendar/CalendarHeader";
import { useCalendarDateStore } from "../store/calendarDate";
import CalendarTable from "../components/Calendar/CalendarTable";

const Calendar = () => {
  const { setCalendarHeight } = useCalendarHeightStore();

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
    <div ref={calendarRef}>
      <CalendarHeader />
      <CalendarTable />
    </div>
  );
};

export default Calendar;
