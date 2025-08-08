import { useQueries } from "@tanstack/react-query";
import { fetchCollection } from "../utils/fetchCollection";
import { useClassesQuery } from "./useQuery";
import { useSemesterStore } from "../store/semesterStore";

interface NormalizedTeacher {
  id: string;
  name: string;
  classId: string;
  role: string;
}

const normalizeTeacher = (stu: any, classId: string) => ({
  id: stu.id,
  name: stu.name,
  classId: stu.class || classId,
  role: "teacher",
});

export const useClassesTeacher = () => {
  const { semester } = useSemesterStore();
  const { data: assignedClasses } = useClassesQuery();

  const queries = useQueries({
    queries: (assignedClasses ?? []).map((cls) => ({
      queryKey: ["teacher", semester, cls.id],
      queryFn: async () => {
        const teachers = await fetchCollection(["semester", semester, "class", cls.id, "teacher"]);
        return teachers.map((teacher) => normalizeTeacher(teacher, cls.id));
      },
      enabled: !!semester,
      staleTime: 1000 * 60 * 5,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  // 반별로 구분된 형태로 리턴
  const teachersByClass = (assignedClasses ?? []).reduce((acc, cls, idx) => {
    acc[cls.id] = queries[idx]?.data ?? [];
    return acc;
  }, {} as Record<string, NormalizedTeacher[]>);

  // 전체 학생 리스트
  const allTeacher = Object.values(teachersByClass).flat();

  return {
    isLoading,
    isError,
    teachersByClass,
    allTeacher,
  };
};
