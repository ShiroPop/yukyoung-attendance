import { useMemo } from "react";
import { UseQueryResult } from "@tanstack/react-query";

interface AttendanceRecord {
  class_id: string;
}

interface AttendanceData {
  dateId: string;
  data: AttendanceRecord[];
}

export const useAttendanceMap = (attendanceQueries: UseQueryResult<AttendanceData>[]): Map<string, number> => {
  return useMemo(() => {
    const map = new Map<string, number>();

    attendanceQueries.forEach((query) => {
      if (query.isSuccess && query.data?.dateId) {
        map.set(query.data.dateId, query.data.data.length);
      }
    });

    return map;
  }, [attendanceQueries]);
};
