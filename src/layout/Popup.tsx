import styled from "styled-components";
import { useStudentsStore } from "../store/studentsStore";
import { useEffect, useState } from "react";
import { addDocument, fetchCollection, useCollectionQuery } from "../utils/firestore";
import { useSemesterStore } from "../store/semesterStore";
import { usePopupStore } from "../store/popupStore";
import { useDateStore } from "../store/dateStore";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";

type AttendanceInfo = {
  id: string;
  name: string;
  state: number; // 0 | 1
};

const PopupWrap = styled.div<{ isPopup: boolean }>`
  position: absolute;
  display: ${({ isPopup }) => (isPopup ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  width: 100vw;
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
  max-height: 350px;
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

const Popup = () => {
  const { isPopup, closePopup } = usePopupStore();
  const { students } = useStudentsStore();
  const { date } = useDateStore();
  const { semester } = useSemesterStore();

  const [attendances, setAttendances] = useState<AttendanceInfo[]>([]);

  const selectedDate = date;

  const isValidPath = semester && selectedDate;

  const {
    data: attendanceRecords = [],
    isLoading,
    isError,
  } = useCollectionQuery(
    isValidPath
      ? ["semester", semester, "attendance", selectedDate, "student_attendance"]
      : (["placeholder"] as [string, ...string[]])
  );

  // 2. 출석 결과 가공
  useEffect(() => {
    if (!selectedDate || !semester || students.length === 0 || !attendanceRecords) return;

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
  }, [attendanceRecords, students, selectedDate, semester]);

  const handleToggle = async (id: string, newState: number) => {
    if (!semester || !selectedDate) return;

    try {
      // 1. 상위 날짜 문서에 dummy 필드 추가 (없으면)
      const dateDocRef = doc(db, "semester", semester, "attendance", selectedDate);
      const dateDocSnap = await getDoc(dateDocRef);

      if (!dateDocSnap.exists()) {
        await setDoc(dateDocRef, {
          createdAt: serverTimestamp(),
          dummy: true,
        });
      }

      // 2. 상태 업데이트 로컬
      setAttendances((prev) => prev.map((att) => (att.id === id ? { ...att, state: newState } : att)));

      // 3. Firestore에 반영 (학생 출석 상태 저장)
      await addDocument(`semester/${semester}/attendance/${selectedDate}/student_attendance`, { state: newState }, id);
    } catch (error) {
      console.error("출석 상태 업데이트 실패:", error);
    }
  };

  return (
    <PopupWrap isPopup={isPopup} onClick={closePopup}>
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
        <div>휴일등록</div>
      </PopupBox>
    </PopupWrap>
  );
};

export default Popup;
