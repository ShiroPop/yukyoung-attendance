import styled from "styled-components";
import { formatDate } from "../../utils/formatDate";
import { getAttendanceColor } from "../../utils/getAttendanceColor";
import { useSelectedDateStore } from "../../store/selectedDateStore";
import { useHolidayQuery } from "../../hooks/useQuery";
import { useAttendanceQueries } from "../../hooks/useAttendanceQueries";
import { useClassesStore } from "../../store/classesStore";
import { useUserStore } from "../../store/userStore";
import { useModalStore } from "../../store/modalStore";
import { useCalendarDateStore } from "../../store/calendarDate";
import { useAttendanceMap } from "../../hooks/useAttendanceMap";

interface CalendarCellProps {
  day: number;
  weekday: number;
  isCurrentMonth: boolean;
}

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

const DateInput = styled.input.attrs({ type: "radio" })`
  display: none;
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

const CalendarCell = ({ day, weekday, isCurrentMonth }: CalendarCellProps) => {
  const { data: holidayDates } = useHolidayQuery();
  const attendanceQueries = useAttendanceQueries();

  const { year, month } = useCalendarDateStore();
  const { selectedDate, setSelectedDate } = useSelectedDateStore();
  const { classId } = useClassesStore();
  const { user } = useUserStore();
  const { openModal } = useModalStore();

  const attendanceMap = useAttendanceMap(attendanceQueries);
  const attendanceCount = attendanceMap.get(formatDate(year, month, day));

  const isAdmin = user?.role === "admin";

  const dateStr = formatDate(year, month, day);
  const color = getAttendanceColor({
    year,
    month,
    day,
    weekday,
    isCurrentMonth,
    holidayDates,
    attendanceQueries,
    classId,
    user,
  });

  if (!isCurrentMonth) {
    return <Cell $isCurrent={false}>{day}</Cell>;
  }

  return (
    <Label $hasData={color}>
      <DateInput
        name="date"
        checked={selectedDate === dateStr}
        value={dateStr}
        onChange={() => setSelectedDate(dateStr)}
        onClick={() => selectedDate === dateStr && openModal()}
        disabled={weekday === 0 || weekday === 6}
      />
      <Cell $isCurrent={true}>
        {day}
        {isAdmin && attendanceCount !== undefined && attendanceCount !== 0 ? (
          <Small $hasData={color}>{attendanceCount}</Small>
        ) : null}
      </Cell>
    </Label>
  );
};

export default CalendarCell;
