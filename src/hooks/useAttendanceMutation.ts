import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firestore";
import { logAction } from "../utils/logAction";
import { useMergedClassMembers } from "./useClassesMember";
import { useClassesStore } from "../store/classesStore";
import { useSemesterStore } from "../store/semesterStore";
import { useSelectedDateStore } from "../store/selectedDateStore";
import { useUserStore } from "../store/userStore";
import { useAttendanceDatesQuery } from "./useQuery";
import { useClassStudentsAttendance } from "./useClassStudentsAttendance";
import { useToastStore } from "../store/toastStore";

type AttendanceRecord = { id: string; state: number };

const logActionSafely = async (params: Parameters<typeof logAction>[0]) => {
  try {
    await logAction(params);
  } catch (logErr) {
    console.error("출석 로그 기록 실패:", logErr);
  }
};

export const useAttendanceMutation = () => {
  const queryClient = useQueryClient();

  const { semester } = useSemesterStore();
  const { selectedDate } = useSelectedDateStore();
  const { classId } = useClassesStore();
  const { user } = useUserStore();

  const { refetch: attendanceDatesRefetch } = useAttendanceDatesQuery();
  const { refetch: classStudentsAttendanceRefetch } = useClassStudentsAttendance(classId.id);

  const { mergedByClass } = useMergedClassMembers(classId.id);
  const classMember = Object.values(mergedByClass).flat();

  const { show } = useToastStore();

  const attendanceQueryKey = ["semester", semester, "attendance", selectedDate, "student_attendance"];

  return useMutation({
    mutationFn: async ({ id, newState }: { id: string; newState: number }) => {
      const dateDocRef = doc(db, "semester", semester, "attendance", selectedDate);
      const studentDocRef = doc(db, "semester", semester, "attendance", selectedDate, "student_attendance", id);

      const student = classMember?.find((s: any) => s.id === id);
      const studentClassId = student?.classId ?? "unknown";

      if (newState === 0) {
        const dateDocSnap = await getDoc(dateDocRef);
        if (!dateDocSnap.exists()) {
          await setDoc(dateDocRef, { createdAt: serverTimestamp() });
        }
        await setDoc(studentDocRef, {
          state: newState,
          created_at: serverTimestamp(),
          class_id: studentClassId,
        });

        await logActionSafely({
          action: "create",
          collection: "student_attendance",
          documentId: id,
          data: newState,
          performedBy: user?.id ?? "unknown",
          targetDate: selectedDate,
        });
      } else {
        await deleteDoc(studentDocRef);

        const studentAttendanceRef = collection(
          db,
          "semester",
          semester,
          "attendance",
          selectedDate,
          "student_attendance"
        );
        const snapshot = await getDocs(studentAttendanceRef);
        const hasPresentStudents = snapshot.docs.some((record) => record.data().state === 0);

        if (!hasPresentStudents) {
          await deleteDoc(dateDocRef);
        }

        await logActionSafely({
          action: "delete",
          collection: "student_attendance",
          documentId: id,
          data: newState,
          performedBy: user?.id ?? "unknown",
          targetDate: selectedDate,
        });
      }
    },
    onMutate: async ({ id, newState }) => {
      await queryClient.cancelQueries({ queryKey: attendanceQueryKey });

      const previousRecords = queryClient.getQueryData<AttendanceRecord[]>(attendanceQueryKey);

      queryClient.setQueryData<AttendanceRecord[]>(attendanceQueryKey, (old = []) => {
        if (newState === 0) {
          const existing = old.find((record) => record.id === id);
          if (existing) {
            return old.map((record) => (record.id === id ? { ...record, state: 0 } : record));
          }
          return [...old, { id, state: 0 }];
        }
        return old.filter((record) => record.id !== id);
      });

      return { previousRecords };
    },
    onSuccess: async (_data, variables) => {
      const { id, newState } = variables;
      const student = classMember?.find((s: any) => s.id === id);
      const studentName = student?.name ?? "알 수 없음";

      show(`${studentName}의 출석 상태가 ${newState === 0 ? "출석" : "결석"}으로 변경되었습니다.`, "success");
    },
    onError: (err, _variables, context) => {
      if (context?.previousRecords) {
        queryClient.setQueryData(attendanceQueryKey, context.previousRecords);
      }
      console.error("출석 상태 업데이트 실패:", err);
      show(`출석 상태 업데이트 실패: ${err}`, "error");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["semester", semester, "attendance"] });
      await queryClient.invalidateQueries({ queryKey: ["attendance", semester, selectedDate] });
      await queryClient.invalidateQueries({ queryKey: ["class-students-attendance", semester, classId.id] });

      attendanceDatesRefetch();
      classStudentsAttendanceRefetch();
    },
  });
};
