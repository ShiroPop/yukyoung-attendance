import styled from "styled-components";
import { useEffect, useState } from "react";
import { addDocument } from "../utils/firestore";
import { useSemesterStore } from "../store/semesterStore";
import { usePopupStore } from "../store/popupStore";
import { useDateStore } from "../store/dateStore";
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAttendanceDatesQuery, useAttendanceQuery, useHolidayQuery, useStudentsQuery } from "../api/useQuery";
import { useClassesStore } from "../store/classesStore";
import { useClassStudentsAttendance } from "../hooks/useClassStudentsAttendance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type AttendanceInfo = {
  id: string;
  name: string;
  state: number; // 0 | 1
};

const PopupWrap = styled.div<{ $isPopup: boolean }>`
  position: absolute;
  display: ${({ $isPopup }) => ($isPopup ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100dvh;
  height: 100vh;
  z-index: 1;
  top: 0;
  backdrop-filter: blur(2px);
  overflow: hidden;
`;

const PopupBox = styled.div`
  width: 80%;
  height: 60%;
  border: 1px solid #cecece;
  border-radius: 16px;
  padding: 12px 16px;
  margin-bottom: 30px;
  background-color: white;
  overflow: hidden;
`;

const ListWrap = styled.div`
  height: 82%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ChildrenList = styled.div`
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-columns: 2fr 1fr;
  padding: 12px 30px;
  border-bottom: 1px solid #cecece;
`;

const ToggleSwitch = styled.label<{ state?: number }>`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  background-color: ${({ state }) => (state ? "#cecece" : "#76c078")};
  border-radius: 34px;
  transition: background-color 0.2s;
  cursor: pointer;

  input {
    display: none;
  }

  span {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 22px;
    height: 22px;
    background-color: white;
    border-radius: 50%;
    transition: left 0.2s;
  }

  input:checked + span {
    left: 26px;
  }

  input:checked + span::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    width: 50px;
    height: 26px;
    background-color: #76c078;
    border-radius: 34px;
    z-index: -1;
  }
`;

const HolidayButton = styled.button<{ $isHoliday: boolean }>`
  width: 100%;
  height: 44px;
  background-color: ${({ $isHoliday }) => ($isHoliday ? "#ff9696" : "#76c078")};
  color: #fff;
  border: none;
  border-radius: 99px;
  font-size: 16px;
  transition: background-color 0.5s, color 0.2s;
  margin-top: 20px;
  cursor: pointer;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ $isHoliday }) => ($isHoliday ? "#ff96964d" : "#76c0784d")};
    }
  }
`;

const HolidayDelButton = styled.button`
  width: 100%;
  height: 44px;
  background-color: #ff9696;
  color: #fff;
  border: none;
  border-radius: 99px;
  font-size: 16px;
  transition: background-color 0.5s, color 0.2s;
  margin-top: 20px;
  cursor: pointer;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: #ff96964d;
    }
  }
`;

const Popup = () => {
  const { isPopup, closePopup } = usePopupStore();
  const { date } = useDateStore();
  const { semester } = useSemesterStore();
  const { classId } = useClassesStore();

  const { data: students } = useStudentsQuery(classId.id);
  const { data: holidayDates, refetch: holidayRefetch } = useHolidayQuery();

  const { refetch: attendanceDatesRefetch } = useAttendanceDatesQuery();
  const { refetch: classStudentsAttendanceRefetch } = useClassStudentsAttendance(classId.id);

  const [attendances, setAttendances] = useState<AttendanceInfo[]>([]);

  const { data: attendanceRecords = [], refetch, isLoading, isError } = useAttendanceQuery();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!date || !semester || !students || students.length === 0 || !attendanceRecords) return;

    const attendanceMap = new Map<string, number>();
    attendanceRecords.forEach((record: { id: string; state: number }) => {
      attendanceMap.set(record.id, record.state);
    });

    const result: AttendanceInfo[] = students.map((stu) => ({
      id: stu.id,
      name: stu.name,
      state: attendanceMap.has(stu.id) ? attendanceMap.get(stu.id)! : 1, // 기본값: 결석
    }));

    setAttendances(result);
  }, [attendanceRecords, students, date, semester]);

  const mutation = useMutation({
    mutationFn: async ({ id, newState }: { id: string; newState: number }) => {
      const dateDocRef = doc(db, "semester", semester!, "attendance", date!);
      const dateDocSnap = await getDoc(dateDocRef);

      if (!dateDocSnap.exists()) {
        await setDoc(dateDocRef, {
          createdAt: serverTimestamp(),
          dummy: true,
        });
      }

      await addDocument(`semester/${semester}/attendance/${date}/student_attendance`, { state: newState }, id);
    },

    onSuccess: async (_, { id }) => {
      await queryClient.invalidateQueries({ queryKey: ["attendance", semester, date] });
      await queryClient.invalidateQueries({ queryKey: ["class-students-attendance", semester, classId] });

      attendanceDatesRefetch();
      classStudentsAttendanceRefetch();
    },

    onError: (err) => {
      console.error("출석 상태 업데이트 실패:", err);
    },
  });

  const handleToggle = async (id: string, newState: number) => {
    setAttendances((prev) => prev.map((att) => (att.id === id ? { ...att, state: newState } : att)));
    mutation.mutate({ id, newState });
  };

  const isHoliday = (date: string): boolean => {
    return holidayDates?.some((holiday) => holiday.id === date) ?? false;
  };

  const holiMutation = useMutation({
    mutationFn: async () => {
      const holiDocRef = doc(db, "holiday", date);
      const holiDocSnap = await getDoc(holiDocRef);

      if (!holiDocSnap.exists()) {
        await setDoc(holiDocRef, {
          name: " ",
        });
      }
    },
    onSuccess: async (_) => {
      await queryClient.invalidateQueries({ queryKey: ["attendance", semester, date] });
      await queryClient.invalidateQueries({ queryKey: ["class-students-attendance", semester, classId] });

      attendanceDatesRefetch();
      classStudentsAttendanceRefetch();
      holidayRefetch();
    },
  });

  const handleHoliBtn = async () => {
    holiMutation.mutate();
  };

  const holiDelMutation = useMutation({
    mutationFn: async () => {
      const docRef = doc(db, "holiday", date);
      await deleteDoc(docRef);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["attendance", semester, date] });
      await queryClient.invalidateQueries({ queryKey: ["class-students-attendance", semester, classId] });

      attendanceDatesRefetch();
      classStudentsAttendanceRefetch();
      holidayRefetch();
    },
  });

  const deleteHolibtn = async () => {
    holiDelMutation.mutate();
  };

  return (
    <PopupWrap $isPopup={isPopup} onClick={closePopup}>
      <PopupBox onClick={(e) => e.stopPropagation()}>
        <ListWrap>
          {attendances.map((ele) => (
            <ChildrenList key={ele.id}>
              <div>{ele.name}</div>
              <ToggleSwitch state={ele.state}>
                <input
                  type="checkbox"
                  checked={ele.state === 0}
                  onChange={() => handleToggle(ele.id, Number(!ele.state))}
                />
                <span />
              </ToggleSwitch>
            </ChildrenList>
          ))}
        </ListWrap>
        <HolidayButton
          onClick={() => {
            if (isHoliday(date)) {
              deleteHolibtn();
            } else {
              handleHoliBtn();
            }
          }}
          $isHoliday={isHoliday(date)}
        >
          휴일{isHoliday(date) ? "삭제" : "등록"}
        </HolidayButton>
      </PopupBox>
    </PopupWrap>
  );
};

export default Popup;
