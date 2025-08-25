import { useQuery } from "@tanstack/react-query";
import { useSemesterStore } from "../store/semesterStore";
import { useAttendanceDatesQuery } from "./useQuery";
import { useAttendanceQueries } from "./useAttendanceQueries";
import { useMergedClassMembers } from "./useClassesMember";

type Student = {
  id: string;
  name: string;
  classId: string;
  state?: number;
};

type WeeklyAttendanceSummary = {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
};

type StudentAttendanceInfo = Student & WeeklyAttendanceSummary;

function getWeekdayName(dateString: string): keyof WeeklyAttendanceSummary | null {
  const date = new Date(dateString);
  const day = date.getDay();
  switch (day) {
    case 1:
      return "monday";
    case 2:
      return "tuesday";
    case 3:
      return "wednesday";
    case 4:
      return "thursday";
    case 5:
      return "friday";
    default:
      return null;
  }
}

export const useClassStudentsAttendance = (classId?: string) => {
  const { semester } = useSemesterStore();
  const { data: attendanceDates = [] } = useAttendanceDatesQuery();

  const attendanceQueries = useAttendanceQueries();
  const { mergedByClass } = useMergedClassMembers(classId);

  const classMember = Object.values(mergedByClass).flat();

  const mainQuery = useQuery<StudentAttendanceInfo[]>({
    queryKey: ["class-students-attendance", semester, classId, attendanceDates, attendanceQueries.map((q) => q.data)],
    enabled: !!semester && !!classId && classMember.length > 0,
    queryFn: () => {
      const studentMap = new Map<string, StudentAttendanceInfo>();

      classMember.forEach((stu) => {
        studentMap.set(stu.id, {
          ...stu,
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
        });
      });

      attendanceQueries.forEach((query, index) => {
        const weekday = getWeekdayName(attendanceDates[index]?.id);
        if (!weekday || !query.data) return;

        query.data.data.forEach((record: any) => {
          const student = studentMap.get(record.id);
          if (student && record.state === 0) {
            student[weekday]! += 1;
          }
        });
      });

      return Array.from(studentMap.values());
    },
  });

  const refetchAll = async () => {
    await Promise.all(attendanceQueries.map((q) => q.refetch?.()));
    return mainQuery.refetch();
  };

  return {
    data: mainQuery.data,
    isLoading: mainQuery.isLoading,
    refetch: refetchAll,
  };
};
