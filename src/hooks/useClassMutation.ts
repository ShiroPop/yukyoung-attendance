import { useMutation, useQueryClient } from "@tanstack/react-query";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firestore";
import { useSemesterStore } from "../store/semesterStore";
import { useToastStore } from "../store/toastStore";
import { useUserStore } from "../store/userStore";

export const useClassMutation = () => {
  const queryClient = useQueryClient();
  const { semester } = useSemesterStore();
  const { show } = useToastStore();
  const { user, addAssignedClass } = useUserStore();

  const addClass = useMutation({
    mutationFn: async (className: string) => {
      if (!className || className.includes("/")) {
        throw new Error("올바르지 않은 반 이름입니다.");
      }
      if (!user) {
        throw new Error("로그인이 필요합니다.");
      }
      await setDoc(doc(db, "semester", semester, "class", className), {});
      await updateDoc(doc(db, "user", user.id), {
        assigned_classes: arrayUnion(className),
      });
    },
    onSuccess: async (_data, className) => {
      addAssignedClass(className);
      await queryClient.invalidateQueries({ queryKey: ["semester", semester, "allClasses"] });
      await queryClient.invalidateQueries({ queryKey: ["semester", semester, "class"] });
      show("반이 추가되었습니다.", "success");
    },
    onError: (err) => {
      show(`반 추가 실패: ${err instanceof Error ? err.message : String(err)}`, "error");
    },
  });

  return {
    addClass: (className: string) => addClass.mutate(className),
    isLoading: addClass.isPending,
  };
};
