import { useMemo } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { useClassesStudents } from "./useClassesStudent";

interface AttendanceRecord {
  id(id: any): string;
  class_id: string;
}

interface AttendanceData {
  dateId: string;
  data: AttendanceRecord[];
}

export const useAttendanceMap = (attendanceQueries: UseQueryResult<AttendanceData>[]): Map<string, number> => {
  const { selectedClassStudents } = useClassesStudents();
  return useMemo(() => {
    const map = new Map<string, number>();

    // selectedClassStudents에서 id만 뽑아서 Set 생성
    const selectedIds = new Set(selectedClassStudents.map((s: { id: string }) => s.id));

    attendanceQueries.forEach((query) => {
      if (query.isSuccess && query.data?.dateId) {
        // 선택된 반의 학생만 필터링
        const filtered = query.data.data.filter((record) => selectedIds.has(record.id));

        map.set(query.data.dateId, filtered.length);
      }
    });

    return map;
  }, [attendanceQueries, selectedClassStudents]);
};
