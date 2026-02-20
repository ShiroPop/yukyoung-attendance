import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firestore";
import { useSemesterStore } from "../store/semesterStore";
import { useToastStore } from "../store/toastStore";

export const useStudentMutation = () => {
  const queryClient = useQueryClient();
  const { semester } = useSemesterStore();
  const { show } = useToastStore();

  const addStudent = useMutation({
    mutationFn: async ({ name, classId }: { name: string; classId: string }) => {
      const trimmed = name.trim();
      if (!trimmed) throw new Error("학생 이름을 입력해주세요.");

      const colRef = collection(db, "semester", semester, "class", classId, "student");
      await addDoc(colRef, { name: trimmed });
      return trimmed;
    },
    onSuccess: (trimmed) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["class-students-attendance"] });
      show(`'${trimmed}' 학생이 추가되었습니다.`, "success");
    },
    onError: (err: Error) => {
      show(err.message, "error");
    },
  });

  const deleteStudent = useMutation({
    mutationFn: async ({ studentId, classId }: { studentId: string; classId: string }) => {
      await deleteDoc(doc(db, "semester", semester, "class", classId, "student", studentId));
      return studentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["class-students-attendance"] });
      show("학생이 삭제되었습니다.", "success");
    },
    onError: (err: Error) => {
      show(`학생 삭제 실패: ${err.message}`, "error");
    },
  });

  return {
    addStudent: (name: string, classId: string) => addStudent.mutate({ name, classId }),
    deleteStudent: (studentId: string, classId: string) => deleteStudent.mutate({ studentId, classId }),
    isAdding: addStudent.isPending,
    isDeleting: deleteStudent.isPending,
  };
};
