import { useMemo } from "react";
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

const normalizeTeacher = (tch: any, classId: string) => ({
  id: tch.id,
  name: tch.name,
  classId: tch.class || classId,
  role: "teacher",
});

export const useClassesTeacher = () => {
  const { semester } = useSemesterStore();
  const { data: assignedClasses } = useClassesQuery();

  const queries = useQueries({
    queries: (assignedClasses ?? []).map((cls) => ({
      queryKey: ["teachers", semester, cls.id],
      queryFn: async () => {
        const teachers = await fetchCollection(["semester", semester, "class", cls.id, "teacher"]);
        return teachers.map((tch) => normalizeTeacher(tch, cls.id));
      },
      enabled: !!semester,
      staleTime: 1000 * 60 * 5,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  // 반별로 구분된 형태로 리턴
  const teachersByClass = useMemo(() => {
    return (assignedClasses ?? []).reduce((acc, cls, idx) => {
      acc[cls.id] = queries[idx]?.data ?? [];
      return acc;
    }, {} as Record<string, NormalizedTeacher[]>);
  }, [assignedClasses, queries.map((q) => q.data)]);

  return {
    isLoading,
    isError,
    teachersByClass,
  };
};
