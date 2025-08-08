import { useQueries } from "@tanstack/react-query";
import { useAttendanceDatesQuery } from "./useQuery";
import { fetchCollection } from "../utils/fetchCollection";
import { useSemesterStore } from "../store/semesterStore";

export const useAttendanceQueries = () => {
  const { semester } = useSemesterStore();
  const { data: attendanceDates = [] } = useAttendanceDatesQuery();

  const attendanceQueries = useQueries({
    queries: (attendanceDates ?? []).map((date) => ({
      queryKey: ["attendance", semester, date.id],
      queryFn: async () => {
        const data = await fetchCollection(["semester", semester!, "attendance", date.id, "student_attendance"]);
        return { dateId: date.id, data };
      },
      enabled: !!semester && !!date.id,
    })),
  });

  return attendanceQueries;
};
