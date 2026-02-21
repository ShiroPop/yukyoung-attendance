import { useMutation, useQueryClient } from "@tanstack/react-query";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firestore";
import { useToastStore } from "../store/toastStore";

interface AssignParams {
  teacherId: string;
  className: string;
}

export const useTeacherMutation = () => {
  const queryClient = useQueryClient();
  const { show } = useToastStore();

  const assignClass = useMutation({
    mutationFn: async ({ teacherId, className }: AssignParams) => {
      await updateDoc(doc(db, "user", teacherId), {
        assigned_classes: arrayUnion(className),
      });
    },
    onSuccess: async (_data, { className }) => {
      await queryClient.invalidateQueries({ queryKey: ["teachers"] });
      await queryClient.invalidateQueries({ queryKey: ["teacher"] });
      show(`"${className}" 반이 배정되었습니다.`, "success");
    },
    onError: (err) => {
      show(`반 배정 실패: ${err instanceof Error ? err.message : String(err)}`, "error");
    },
  });

  const unassignClass = useMutation({
    mutationFn: async ({ teacherId, className }: AssignParams) => {
      await updateDoc(doc(db, "user", teacherId), {
        assigned_classes: arrayRemove(className),
      });
    },
    onSuccess: async (_data, { className }) => {
      await queryClient.invalidateQueries({ queryKey: ["teachers"] });
      await queryClient.invalidateQueries({ queryKey: ["teacher"] });
      show(`"${className}" 반이 해제되었습니다.`, "success");
    },
    onError: (err) => {
      show(`반 해제 실패: ${err instanceof Error ? err.message : String(err)}`, "error");
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
