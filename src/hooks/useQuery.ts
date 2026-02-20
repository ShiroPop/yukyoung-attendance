import { useQuery } from "@tanstack/react-query";
import { fetchCollection } from "../utils/fetchCollection";
import { useSelectedDateStore } from "../store/selectedDateStore";
import { useSemesterStore } from "../store/semesterStore";
import { useUserStore } from "../store/userStore";

interface ClassId {
  id: string;
}

export const useHolidayQuery = () => {
  return useQuery({
    queryKey: ["holiday"],
    queryFn: () => fetchCollection(["holiday"]),
  });
};

export const useAttendanceQuery = () => {
  const { semester } = useSemesterStore();
  const { selectedDate } = useSelectedDateStore();

  return useQuery({
    queryKey: ["semester", semester, "attendance", selectedDate, "student_attendance"],
    queryFn: () => fetchCollection(["semester", semester, "attendance", selectedDate, "student_attendance"]),
  });
};

export const useClassesQuery = () => {
  const { semester } = useSemesterStore();
  const { user } = useUserStore();

  return useQuery({
    queryKey: ["semester", semester, "class", user?.id],
    queryFn: async () => {
      const allClasses = await fetchCollection(["semester", semester, "class"]);

      if (!user || !user.assigned_classes) return [];

      const filtered = allClasses.filter((classItem: ClassId) => user.assigned_classes.includes(classItem.id));

      return filtered;
    },
    enabled: !!semester && !!user,
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
  const { data: assignedClasses } = useClassesQuery();

  return useQuery({
    queryKey: ["students", semester, classId, assignedClasses],
    queryFn: async () => {
      if (classId === "all") {
        const classes = assignedClasses ?? [];

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

export const useSemesterListQuery = () => {
  return useQuery({
    queryKey: ["semester"],
    queryFn: () => fetchCollection(["semester"]),
  });
};

export const useAttendanceDatesQuery = () => {
  const { semester } = useSemesterStore();

  return useQuery({
    queryKey: ["semester", semester, "attendance"],
    queryFn: async () => fetchCollection(["semester", semester, "attendance"]),
  });
};
