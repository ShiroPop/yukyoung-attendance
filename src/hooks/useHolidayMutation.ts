import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firestore";

export const useHolidayMutation = ({
  date,
  semester,
  classId,
  attendanceDatesRefetch,
  classStudentsAttendanceRefetch,
  holidayRefetch,
}: any) => {
  const queryClient = useQueryClient();

  const registerHoliday = useMutation({
    mutationFn: async () => {
      const holiDocRef = doc(db, "holiday", date);
      const holiDocSnap = await getDoc(holiDocRef);
      if (!holiDocSnap.exists()) {
        await setDoc(holiDocRef, { name: " " });
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["attendance", semester, date] });
      await queryClient.invalidateQueries({ queryKey: ["class-students-attendance", semester, classId] });
      attendanceDatesRefetch();
      classStudentsAttendanceRefetch();
      holidayRefetch();
    },
  });

  const deleteHoliday = useMutation({
    mutationFn: async () => {
      await deleteDoc(doc(db, "holiday", date));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["attendance", semester, date] });
      await queryClient.invalidateQueries({ queryKey: ["class-students-attendance", semester, classId] });
      attendanceDatesRefetch();
      classStudentsAttendanceRefetch();
      holidayRefetch();
    },
  });

  return {
    registerHoliday: () => registerHoliday.mutate(),
    deleteHoliday: () => deleteHoliday.mutate(),
  };
};
