import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firestore";
import { logAction } from "../utils/logAction";

export const useAttendanceMutation = ({
  students,
  attendanceRecords,
  semester,
  date,
  user,
  classId,
  attendanceDatesRefetch,
  classStudentsAttendanceRefetch,
}: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newState }: { id: string; newState: number }) => {
      const dateDocRef = doc(db, "semester", semester, "attendance", date);
      const studentDocRef = doc(db, "semester", semester, "attendance", date, "student_attendance", id);

      const student = students?.find((s: any) => s.id === id);
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

        await logAction({
          action: "create",
          collection: "student_attendance",
          documentId: id,
          data: newState,
          performedBy: user?.id ?? "unknown",
        });
      } else {
        await logAction({
          action: "delete",
          collection: "student_attendance",
          documentId: id,
          data: newState,
          performedBy: user?.id ?? "unknown",
        });

        await deleteDoc(studentDocRef);

        const remaining = attendanceRecords.filter((r: any) => r.id !== id && r.state === 0);
        if (remaining.length === 0) {
          await deleteDoc(dateDocRef);
        }
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["attendance", semester, date] });
      await queryClient.invalidateQueries({ queryKey: ["class-students-attendance", semester, classId] });

      attendanceDatesRefetch();
      classStudentsAttendanceRefetch();
    },
    onError: (err) => {
      console.error("출석 상태 업데이트 실패:", err);
    },
  });
};
