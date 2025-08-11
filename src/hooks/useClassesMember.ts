import { useMemo } from "react";
import { useClassesStudents } from "./useClassesStudent";
import { useClassesTeacher } from "./useClassesTeacher";

// 공통 멤버 타입
export interface ClassMember {
  id: string;
  name: string;
  classId: string;
  role?: string;
}

// 클래스별 병합된 타입
export type MergedByClass = {
  [className: string]: ClassMember[];
};

// 인자로 받을 수 있는 classId 타입
type ClassIdFilter = "all" | string | string[];

export const useMergedClassMembers = (classId: ClassIdFilter = "all"): { mergedByClass: MergedByClass } => {
  const { studentsByClass } = useClassesStudents();
  const { teachersByClass } = useClassesTeacher();

  const mergedByClass = useMemo(() => {
    const result: MergedByClass = {};

    const classNames =
      classId === "all"
        ? Object.keys(studentsByClass).filter((className) => teachersByClass.hasOwnProperty(className))
        : Array.isArray(classId)
        ? classId
        : [classId];

    for (const className of classNames) {
      if (studentsByClass.hasOwnProperty(className) && teachersByClass.hasOwnProperty(className)) {
        result[className] = [...(teachersByClass[className] ?? []), ...(studentsByClass[className] ?? [])];
      }
    }

    return result;
  }, [classId, studentsByClass, teachersByClass]);

  return { mergedByClass };
};
