import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firestore";
import { useSemesterStore } from "../store/semesterStore";
import { useToastStore } from "../store/toastStore";

interface AssignParams {
  teacherId: string;
  className: string;
}

const parseClassToGradeClass = (className: string): string => {
  return className.replace(/\D/g, "");
};

const getNextTeacherNumber = (
  docs: { id: string }[],
  gradeClass: string
): number => {
  const pattern = new RegExp(`^z_teacher_${gradeClass}_(\\d+)$`);
  const numbers = docs
    .map((d) => {
      const match = d.id.match(pattern);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => n > 0);

  return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
};

export const useTeacherMutation = () => {
  const queryClient = useQueryClient();
  const { show } = useToastStore();
  const { semester } = useSemesterStore();

  const assignClass = useMutation({
    mutationFn: async ({ teacherId, className }: AssignParams) => {
      await updateDoc(doc(db, "user", teacherId), {
        assigned_classes: arrayUnion(className),
      });

      const teacherCollectionRef = collection(
        db,
        "semester",
        semester,
        "class",
        className,
        "teacher"
      );
      const snapshot = await getDocs(teacherCollectionRef);

      const gradeClass = parseClassToGradeClass(className);
      const nextNumber = getNextTeacherNumber(snapshot.docs, gradeClass);
      const teacherDocId = `z_teacher_${gradeClass}_${nextNumber}`;

      await setDoc(doc(teacherCollectionRef, teacherDocId), {
        class_id: className,
        name: teacherId,
        role: "teacher",
      });
    },
    onSuccess: async (_data, { className }) => {
      await queryClient.invalidateQueries({ queryKey: ["teachers"] });
      await queryClient.invalidateQueries({ queryKey: ["teacher"] });
      await queryClient.invalidateQueries({
        queryKey: ["teachers", semester, className],
      });
      show(`"${className}" 반이 배정되었습니다.`, "success");
    },
    onError: (err) => {
      show(
        `반 배정 실패: ${err instanceof Error ? err.message : String(err)}`,
        "error"
      );
    },
  });

  const unassignClass = useMutation({
    mutationFn: async ({ teacherId, className }: AssignParams) => {
      await updateDoc(doc(db, "user", teacherId), {
        assigned_classes: arrayRemove(className),
      });

      const teacherCollectionRef = collection(
        db,
        "semester",
        semester,
        "class",
        className,
        "teacher"
      );
      const snapshot = await getDocs(teacherCollectionRef);
      const teacherDoc = snapshot.docs.find(
        (d) => d.data().name === teacherId
      );
      if (teacherDoc) {
        await deleteDoc(teacherDoc.ref);
      }
    },
    onSuccess: async (_data, { className }) => {
      await queryClient.invalidateQueries({ queryKey: ["teachers"] });
      await queryClient.invalidateQueries({ queryKey: ["teacher"] });
      await queryClient.invalidateQueries({
        queryKey: ["teachers", semester, className],
      });
      show(`"${className}" 반이 해제되었습니다.`, "success");
    },
    onError: (err) => {
      show(
        `반 해제 실패: ${err instanceof Error ? err.message : String(err)}`,
        "error"
      );
    },
  });

  return {
    assignClass: (teacherId: string, className: string) =>
      assignClass.mutate({ teacherId, className }),
    unassignClass: (teacherId: string, className: string) =>
      unassignClass.mutate({ teacherId, className }),
    isLoading: assignClass.isPending || unassignClass.isPending,
  };
};
