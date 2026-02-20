import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firestore";
import { useToastStore } from "../store/toastStore";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const useSemesterMutation = () => {
  const queryClient = useQueryClient();
  const { show } = useToastStore();

  return useMutation({
    mutationFn: async (startDate: string) => {
      if (!DATE_REGEX.test(startDate)) {
        throw new Error("날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)");
      }

      await setDoc(doc(db, "semester", startDate), {});
      return startDate;
    },
    onSuccess: (startDate) => {
      queryClient.invalidateQueries({ queryKey: ["semester"] });
      show(`'${startDate}' 학기가 추가되었습니다.`, "success");
    },
    onError: (err: Error) => {
      show(err.message, "error");
    },
  });
};
