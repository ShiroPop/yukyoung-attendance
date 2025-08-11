import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { fetchCollection } from "../utils/fetchCollection";
import { useClassesQuery } from "./useQuery";
import { useSemesterStore } from "../store/semesterStore";
import { useClassesStore } from "../store/classesStore";
import { useUserStore } from "../store/userStore";

interface NormalizedStudent {
  id: string;
  name: string;
  classId: string;
}

const normalizeStudent = (stu: any, classId: string) => ({
  id: stu.id,
  name: stu.name,
  classId: stu.class || classId,
});

export const useClassesStudents = () => {
  const { semester } = useSemesterStore();
  const { data: assignedClasses } = useClassesQuery();
  const { classId } = useClassesStore();
  const { user } = useUserStore();

  const queries = useQueries({
    queries: (assignedClasses ?? []).map((cls) => ({
      queryKey: ["students", semester, cls.id],
      queryFn: async () => {
        const students = await fetchCollection(["semester", semester, "class", cls.id, "student"]);
        return students.map((stu) => normalizeStudent(stu, cls.id));
      },
      enabled: !!semester,
      staleTime: 1000 * 60 * 5,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  // 반별로 구분된 형태로 리턴
  const studentsByClass = useMemo(() => {
    return (assignedClasses ?? []).reduce((acc, cls, idx) => {
      acc[cls.id] = queries[idx]?.data ?? [];
      return acc;
    }, {} as Record<string, NormalizedStudent[]>);
  }, [assignedClasses, queries.map((q) => q.data)]);

  // 모든 학생 리스트
  const allStudents = useMemo(() => Object.values(studentsByClass).flat(), [studentsByClass]);

  // 선택한 반 학생 리스트
  const selectedClassStudents = useMemo(() => {
    if (classId.id === "all") return allStudents;
    if (Array.isArray(classId.id)) return classId.id.flatMap((id) => studentsByClass[id] ?? []);
    return studentsByClass[classId.id] ?? [];
  }, [classId.id, allStudents, studentsByClass]);

  return {
    isLoading,
    isError,
    studentsByClass,
    allStudents,
    selectedClassStudents,
  };
};
