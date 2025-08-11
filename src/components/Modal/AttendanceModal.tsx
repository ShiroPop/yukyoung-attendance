import { useEffect, useRef, useState } from "react";
import { useSemesterStore } from "../../store/semesterStore";
import { useModalStore } from "../../store/modalStore";
import { useSelectedDateStore } from "../../store/selectedDateStore";
import { useClassesStore } from "../../store/classesStore";
import { useUserStore } from "../../store/userStore";
import { useAttendanceQuery, useHolidayQuery } from "../../hooks/useQuery";
import { useAttendanceMutation } from "../../hooks/useAttendanceMutation";
import { useHolidayMutation } from "../../hooks/useHolidayMutation";
import { isHoliday } from "../../utils/dateUtils";

import { ModalWrap, ModalBox, ListWrap, LogoutIcon } from "./AttendanceModal.styles";

import AttendanceList from "./AttendanceList";
import HolidayButton from "./HolidayButton";
import { useMergedClassMembers } from "../../hooks/useClassesMember";

export type AttendanceInfo = {
  id: string;
  name: string;
  state: number;
};

interface MergedByClass {}

const AttendanceModal = () => {
  const { isModal, closeModal } = useModalStore();
  const { selectedDate } = useSelectedDateStore();
  const { semester } = useSemesterStore();
  const { classId } = useClassesStore();
  const { user } = useUserStore();

  const { data: holidayDates } = useHolidayQuery();
  const { data: attendanceRecords = [] } = useAttendanceQuery();

  const { mergedByClass } = useMergedClassMembers(classId.id);

  const [attendances, setAttendances] = useState<AttendanceInfo[]>([]);

  const classMember = Object.values(mergedByClass).flat();

  const attendanceMutation = useAttendanceMutation();

  const { registerHoliday, deleteHoliday } = useHolidayMutation();

  const handleToggle = (id: string, newState: number) => {
    setAttendances((prev) => prev.map((att) => (att.id === id ? { ...att, state: newState } : att)));
    attendanceMutation.mutate({ id, newState });
  };

  const prevMergedRef = useRef<MergedByClass>([]);
  const prevAttendanceRecords = useRef<MergedByClass>([]);

  useEffect(() => {
    const isMergedByClassChanged = JSON.stringify(prevMergedRef.current) !== JSON.stringify(mergedByClass);
    const isAttendanceRecordsChanged =
      JSON.stringify(prevAttendanceRecords.current) !== JSON.stringify(attendanceRecords);
    if (isMergedByClassChanged || isAttendanceRecordsChanged) {
      prevMergedRef.current = mergedByClass;
      prevAttendanceRecords.current = attendanceRecords;

      if (!selectedDate || !semester || !classMember || classMember.length === 0 || !attendanceRecords) return;

      const attendanceMap = new Map<string, number>();
      attendanceRecords.forEach((record: { id: string; state: number }) => {
        attendanceMap.set(record.id, record.state);
      });

      const result: AttendanceInfo[] = classMember.map((stu) => ({
        id: stu.id,
        name: stu.name,
        state: attendanceMap.get(stu.id) ?? 1,
      }));

      setAttendances(result);
    }
  }, [mergedByClass, attendanceRecords, classId, selectedDate, semester]);

  return (
    <ModalWrap $isModal={isModal} onClick={closeModal}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <LogoutIcon onClick={closeModal} />
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
