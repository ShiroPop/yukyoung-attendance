import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firestore";
import { useSemesterStore } from "../store/semesterStore";
import { useUserStore } from "../store/userStore";
import { useToastStore } from "../store/toastStore";

export const useClassMutation = () => {
  const queryClient = useQueryClient();
  const { semester } = useSemesterStore();
  const { user, setUser } = useUserStore();
  const { show } = useToastStore();

  return useMutation({
    mutationFn: async (className: string) => {
      const trimmed = className.trim();
      if (!trimmed) throw new Error("반 이름을 입력해주세요.");
      if (trimmed.includes("/")) throw new Error("반 이름에 '/'를 포함할 수 없습니다.");
      if (!user) throw new Error("로그인이 필요합니다.");

      await setDoc(doc(db, "semester", semester, "class", trimmed), {});
      await updateDoc(doc(db, "user", user.id), {
        assigned_classes: arrayUnion(trimmed),
      });

      return trimmed;
    },
    onSuccess: (trimmed) => {
      const currentUser = useUserStore.getState().user;
      if (currentUser) {
        setUser({
          ...currentUser,
          assigned_classes: [...currentUser.assigned_classes, trimmed],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["semester", semester, "class"] });
      show(`'${trimmed}' 반이 추가되었습니다.`, "success");
    },
    onError: (err: Error) => {
      show(err.message, "error");
    },
  });
};
