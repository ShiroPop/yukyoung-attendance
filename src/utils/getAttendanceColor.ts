import { formatDate } from "./formatDate";

interface AttendanceRecord {
  class_id: string;
}

interface AttendanceQuery {
  data?: {
    dateId: string;
    data: AttendanceRecord[];
  };
  isSuccess?: boolean;
}

interface Holiday {
  id: string; // e.g. "2025-08-15"
}

interface GetAttendanceColorParams {
  year: number;
  month: number;
  day: number;
  weekday: number; // 0 = 일요일, 6 = 토요일
  isCurrentMonth: boolean;
  holidayDates: Holiday[] | undefined;
  attendanceQueries: AttendanceQuery[];
  classId: { id: string };
  user: {
    role: string;
    assigned_classes: string[];
  } | null;
}

/**
 * 출석 정보와 날짜 정보에 따라 달력 셀 색상을 반환
 */
export const getAttendanceColor = ({
  year,
  month,
  day,
  weekday,
  isCurrentMonth,
  holidayDates,
  attendanceQueries,
  classId,
  user,
}: GetAttendanceColorParams): string => {
  if (!isCurrentMonth) return "#E2E2E2"; // 다른 달

  const dateStr = formatDate(year, month, day);

  let hasAttendance = false;

  if (classId.id === "all") {
    hasAttendance = attendanceQueries.some(
      (query) =>
        query.data?.dateId === dateStr &&
        query.data?.data?.some((record) => user?.assigned_classes.includes(record.class_id))
    );
  } else {
    const attendanceForClass = attendanceQueries.filter((query) =>
      query.data?.data.some((student) => student.class_id === classId.id)
    );

    hasAttendance = attendanceForClass.some(
      (query) =>
        query.data?.dateId === dateStr &&
        query.data?.data?.length > 0 &&
        query.data?.data?.some((record) => user?.assigned_classes.includes(record.class_id))
    );
  }

  const isHoliday = holidayDates?.some((d) => d.id === dateStr) ?? false;
  const isWeekend = weekday === 0 || weekday === 6;

  if (isWeekend) return "#FF9696"; // 주말
  if (hasAttendance && isHoliday) return "#FFB37D"; // 휴일 + 출석
  if (hasAttendance) return "none"; // 출석
  if (isHoliday) return "#FF9696"; // 휴일만

  return "#E2E2E2"; // 아무것도 없는 날
};
