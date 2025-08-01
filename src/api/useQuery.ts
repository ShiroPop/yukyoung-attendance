import { useQuery } from "@tanstack/react-query";
import { fetchCollection } from "../utils/firestore";
import { useDateStore } from "../store/dateStore";
import { useSemesterStore } from "../store/semesterStore";

export const useHolidayQuery = () => {
  return useQuery({
    queryKey: ["holiday"],
    queryFn: () => fetchCollection(["holiday"]),
  });
};

export const useAttendanceQuery = () => {
  const { semester } = useSemesterStore();
  const { date } = useDateStore();

  return useQuery({
    queryKey: ["semester", semester, "attendance", date, "student_attendance"],
    queryFn: () => fetchCollection(["semester", semester, "attendance", date, "student_attendance"]),
  });
};

export const useClasses = () => {
  const { semester } = useSemesterStore();
  return useQuery({
    queryKey: ["semester", semester, "class"],
    queryFn: () => fetchCollection(["semester", semester, "class"]),
  });
};

const normalizeStudent = (stu: any, classId: string) => ({
  id: stu.id,
  name: stu.name,
  classId: stu.class || classId,
  monday: 0,
  tuesday: 0,
  wednesday: 0,
  thursday: 0,
  friday: 0,
});

export const useStudentsQuery = (classId: string) => {
  const { semester } = useSemesterStore();

  return useQuery({
    queryKey: ["students", semester, classId],
    queryFn: async () => {
      if (classId === "전체") {
        const classes = await fetchCollection(["semester", semester, "class"]);

        const allStudents = await Promise.all(
          classes.map(async (cls) => {
            const students = await fetchCollection(["semester", semester, "class", cls.id, "student"]);
            return students.map((stu) => normalizeStudent(stu, cls.id));
          })
        );

        return allStudents.flat(); // 2차원 배열 → 1차원
      } else {
        const students = await fetchCollection(["semester", semester, "class", classId, "student"]);
        return students.map((stu) => normalizeStudent(stu, classId));
      }
    },
    staleTime: 1000 * 60 * 5, // 5분 캐싱
    enabled: !!semester && !!classId, // 조건 있을 때만 fetch
  });
};

export const useAttendanceDatesQuery = () => {
  const { semester } = useSemesterStore();

  return useQuery({
    queryKey: ["semester", semester, "attendance"],
    queryFn: async () => fetchCollection(["semester", semester, "attendance"]),
  });
};
