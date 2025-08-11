import { useEffect, useRef } from "react";
import { useCalendarHeightStore } from "../store/calendarHeightStore";
import CalendarHeader from "../components/Calendar/CalendarHeader";
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
