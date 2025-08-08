import { useEffect, useState } from "react";
import { useSemesterStore } from "../../store/semesterStore";
import { useModalStore } from "../../store/modalStore";
import { useSelectedDateStore } from "../../store/selectedDateStore";
import { useClassesStore } from "../../store/classesStore";
import { useUserStore } from "../../store/userStore";
import { useAttendanceDatesQuery, useAttendanceQuery, useHolidayQuery, useStudentsQuery } from "../../hooks/useQuery";
import { useClassStudentsAttendance } from "../../hooks/useClassStudentsAttendance";
import { useAttendanceMutation } from "../../hooks/useAttendanceMutation";
import { useHolidayMutation } from "../../hooks/useHolidayMutation";
import { isHoliday } from "../../utils/dateUtils";

import { ModalWrap, ModalBox, ListWrap } from "./AttendanceModal.styles";

import AttendanceList from "./AttendanceList";
import HolidayButton from "./HolidayButton";

export type AttendanceInfo = {
  id: string;
  name: string;
  state: number;
};

const AttendanceModal = () => {
  const { isModal, closeModal } = useModalStore();
  const { selectedDate } = useSelectedDateStore();
  const { semester } = useSemesterStore();
  const { classId } = useClassesStore();
  const { user } = useUserStore();

  const { data: students } = useStudentsQuery(classId.id);
  const { data: holidayDates, refetch: holidayRefetch } = useHolidayQuery();
  const { data: attendanceRecords = [] } = useAttendanceQuery();

  const [attendances, setAttendances] = useState<AttendanceInfo[]>([]);

  const { refetch: attendanceDatesRefetch } = useAttendanceDatesQuery();
  const { refetch: classStudentsAttendanceRefetch } = useClassStudentsAttendance(classId.id);

  const attendanceMutation = useAttendanceMutation({
    students,
    attendanceRecords,
    semester,
    selectedDate,
    user,
    classId,
    attendanceDatesRefetch,
    classStudentsAttendanceRefetch,
  });

  const { registerHoliday, deleteHoliday } = useHolidayMutation({
    selectedDate,
    semester,
    classId,
    attendanceDatesRefetch,
    classStudentsAttendanceRefetch,
    holidayRefetch,
  });

  const handleToggle = (id: string, newState: number) => {
    setAttendances((prev) => prev.map((att) => (att.id === id ? { ...att, state: newState } : att)));
    attendanceMutation.mutate({ id, newState });
  };

  useEffect(() => {
    if (!selectedDate || !semester || !students || students.length === 0 || !attendanceRecords) return;

    const attendanceMap = new Map<string, number>();
    attendanceRecords.forEach((record: { id: string; state: number }) => {
      attendanceMap.set(record.id, record.state);
    });

    const result: AttendanceInfo[] = students.map((stu) => ({
      id: stu.id,
      name: stu.name,
      state: attendanceMap.get(stu.id) ?? 1,
    }));

    setAttendances(result);
  }, [attendanceRecords, students, selectedDate, semester]);

  return (
    <ModalWrap $isModal={isModal} onClick={closeModal}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ListWrap>
          <AttendanceList attendances={attendances} onToggle={handleToggle} />
        </ListWrap>

        {user?.role === "admin" && (
          <HolidayButton
            isHoliday={isHoliday(selectedDate, holidayDates)}
            onClick={() => (isHoliday(selectedDate, holidayDates) ? deleteHoliday() : registerHoliday())}
          />
        )}
      </ModalBox>
    </ModalWrap>
  );
};

export default AttendanceModal;
