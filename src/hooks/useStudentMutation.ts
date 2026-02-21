import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firestore";
import { useSemesterStore } from "../store/semesterStore";
import { useToastStore } from "../store/toastStore";

export const useStudentMutation = () => {
  const queryClient = useQueryClient();
  const { semester } = useSemesterStore();
  const { show } = useToastStore();

  const addStudent = useMutation({
    mutationFn: async ({ name, classId }: { name: string; classId: string }) => {
      const studentRef = doc(collection(db, "semester", semester, "class", classId, "student"));
      await setDoc(studentRef, { name });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["students"] });
      show("학생이 추가되었습니다.", "success");
    },
    onError: (err) => {
      show(`학생 추가 실패: ${err instanceof Error ? err.message : String(err)}`, "error");
    },
  });

  const deleteStudent = useMutation({
    mutationFn: async ({ studentId, classId }: { studentId: string; classId: string }) => {
      await deleteDoc(doc(db, "semester", semester, "class", classId, "student", studentId));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["students"] });
      show("학생이 삭제되었습니다.", "success");
    },
    onError: (err) => {
      show(`학생 삭제 실패: ${err instanceof Error ? err.message : String(err)}`, "error");
    },
  });

  return {
    addStudent: (name: string, classId: string) => addStudent.mutate({ name, classId }),
    deleteStudent: (studentId: string, classId: string) => deleteStudent.mutate({ studentId, classId }),
    isAddLoading: addStudent.isPending,
    isDeleteLoading: deleteStudent.isPending,
  };
};
