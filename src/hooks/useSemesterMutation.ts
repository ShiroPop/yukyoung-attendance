import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firestore";
import { useToastStore } from "../store/toastStore";

export const useSemesterMutation = () => {
  const queryClient = useQueryClient();
  const { show } = useToastStore();

  const addSemester = useMutation({
    mutationFn: async (startDate: string) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
        throw new Error("날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)");
      }
      await setDoc(doc(db, "semester", startDate), {});
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["semester"] });
      show("학기가 추가되었습니다.", "success");
    },
    onError: (err) => {
      show(`학기 추가 실패: ${err instanceof Error ? err.message : String(err)}`, "error");
    },
  });

  return {
    addSemester: (startDate: string) => addSemester.mutate(startDate),
    isLoading: addSemester.isPending,
  };
};
