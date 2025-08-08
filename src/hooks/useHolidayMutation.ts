import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firestore";
import { useSelectedDateStore } from "../store/selectedDateStore";
import { useSemesterStore } from "../store/semesterStore";
import { useAttendanceDatesQuery, useHolidayQuery } from "./useQuery";
import { useClassStudentsAttendance } from "./useClassStudentsAttendance";
import { useClassesStore } from "../store/classesStore";

export const useHolidayMutation = () => {
  const { semester } = useSemesterStore();
  const { selectedDate } = useSelectedDateStore();
  const { classId } = useClassesStore();

  const { refetch: holidayRefetch } = useHolidayQuery();
  const { refetch: attendanceDatesRefetch } = useAttendanceDatesQuery();
  const { refetch: classStudentsAttendanceRefetch } = useClassStudentsAttendance(classId.id);

  const queryClient = useQueryClient();

  const registerHoliday = useMutation({
    mutationFn: async () => {
      const holiDocRef = doc(db, "holiday", selectedDate);
      const holiDocSnap = await getDoc(holiDocRef);
      if (!holiDocSnap.exists()) {
        await setDoc(holiDocRef, { name: " " });
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["attendance", semester, selectedDate] });
      await queryClient.invalidateQueries({ queryKey: ["class-students-attendance", semester, classId] });
      attendanceDatesRefetch();
      classStudentsAttendanceRefetch();
      holidayRefetch();
    },
  });

  const deleteHoliday = useMutation({
    mutationFn: async () => {
      await deleteDoc(doc(db, "holiday", selectedDate));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["attendance", semester, selectedDate] });
      await queryClient.invalidateQueries({ queryKey: ["class-students-attendance", semester, classId] });
      attendanceDatesRefetch();
      classStudentsAttendanceRefetch();
      holidayRefetch();
    },
    onError: (err) => {
      console.error("공휴일 업데이트 실패:", err);
    },
  });

  return {
    registerHoliday: () => registerHoliday.mutate(),
    deleteHoliday: () => deleteHoliday.mutate(),
  };
};
