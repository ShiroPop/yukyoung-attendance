import { useState } from "react";
import styled from "styled-components";
import { useClassesStore } from "../store/classesStore";
import { useClassStudentsAttendance } from "../hooks/useClassStudentsAttendance";
import { useCalendarHeightStore } from "../store/calendarHeightStore";
import { useUserStore } from "../store/userStore";
import { useStudentMutation } from "../hooks/useStudentMutation";

const ChildListWrapper = styled.div`
  flex-shrink: 0;
  overflow-y: auto;
  flex: 1;
`;

const Head = styled.div`
  position: relative;
  width: 100%;
  background-color: #76c078;
  color: #fff;
`;

const HeadContent = styled.div`
  display: grid;
  justify-items: end;
  grid-template-columns: 2fr 1fr;
  max-width: 600px;
  margin: 0 auto;
  padding: 8px 30px;
`;

const Name = styled.div<{ $isBody?: boolean }>`
  width: 100%;
  text-align: ${({ $isBody }) => ($isBody ? "left" : "")};
  color: ${({ $isBody }) => ($isBody ? "#76c078" : "#fff")};
  word-break: keep-all;
  white-space: pre-wrap;
`;

const AttendanceBox = styled.div`
  display: flex;
`;

const Attendance = styled.span<{ color?: string }>`
  width: 24px;
  margin: 0 4px;
  color: ${({ color }) => (color ? color : "#fff")};
`;

const ListWrapper = styled.div<{ $calendarHeight: number }>`
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100dvh - 145px - ${({ $calendarHeight }) => $calendarHeight}px);
  height: calc(100vh - 145px - ${({ $calendarHeight }) => $calendarHeight}px);
  scrollbar-width: none;

  @media (min-width: 910px) {
    height: calc(100dvh - 40px);
    height: calc(100vh - 40px);
  }
`;

const Children = styled.div`
  width: 100%;
`;

const ChildrenContent = styled.div<{ $isEditMode?: boolean }>`
  display: grid;
  justify-items: end;
  grid-template-columns: ${({ $isEditMode }) =>
    $isEditMode ? "auto 2fr 1fr" : "2fr 1fr"};
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 12px 30px;
`;

const EditButton = styled.button<{ $active?: boolean }>`
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ $active }) => ($active ? "#FFD700" : "#fff")};
  font-size: 13px;
  cursor: pointer;
  padding: 2px 8px;
  white-space: nowrap;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff5959;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  padding: 0 8px 0 0;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: #ff9696;
    }
  }
`;

const AddStudentRow = styled.div`
  display: flex;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 8px 30px;
  gap: 8px;
`;

const AddStudentInput = styled.input`
  flex: 1;
  border: 1px solid #4caf50;
  border-radius: 10px;
  height: 38px;
  padding: 0 12px;
  outline: none;
  color: #76c078;
  font-size: 14px;
`;

const AddStudentButton = styled.button`
  background-color: #76c078;
  color: #fff;
  border: none;
  height: 38px;
  border-radius: 10px;
  padding: 6px 16px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  transition: background-color 0.5s;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: #76c0784d;
    }
  }
`;

const ChildList = () => {
  const { classId } = useClassesStore();
  const { user } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { calendarHeight, isChildListShrunk, openChildList, closeChildList } =
    useCalendarHeightStore();

  const { data: student = [] } = useClassStudentsAttendance(classId.id);

  const [isEditMode, setIsEditMode] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");

  const { addStudent, deleteStudent, isAdding } = useStudentMutation();

  const isSpecificClass = classId.id !== "all";

  const getBorderStyle = (index: number) => {
    const ele = student[index];
    const prev = index > 0 ? student[index - 1] : undefined;
    const next = index < student.length - 1 ? student[index + 1] : undefined;

    const isTeacher = ele.role === "teacher";
    const prevIsTeacher = prev?.role === "teacher";
    const nextIsTeacher = next?.role === "teacher";

    if (isTeacher) {
      return {
        borderTop: prevIsTeacher ? "1px solid #bbb" : "1px solid #bbb",
        borderBottom: nextIsTeacher ? "none" : "1px solid #bbb",
        fontWeight: isTeacher ? "600" : "400",
      } as React.CSSProperties;
    }

    return {
      fontWeight: isTeacher ? "600" : "400",
      borderBottom: nextIsTeacher ? "none" : "1px dashed #cecece",
    } as React.CSSProperties;
  };

  const handleDeleteStudent = (
    studentId: string,
    studentName: string,
    studentClassId: string,
  ) => {
    if (window.confirm(`'${studentName}' 학생을 삭제하시겠습니까?`)) {
      deleteStudent(studentId, studentClassId);
    }
  };

  const handleAddStudent = () => {
    const trimmed = newStudentName.trim();
    if (!trimmed) return;
    addStudent(trimmed, classId.id);
    setNewStudentName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddStudent();
    }
  };

  return (
    <ChildListWrapper>
      <Head onClick={isChildListShrunk ? closeChildList : openChildList}>
        <HeadContent>
          <Name>이름</Name>
          <AttendanceBox>
            <Attendance>월</Attendance>
            <Attendance>화</Attendance>
            <Attendance>수</Attendance>
            <Attendance>목</Attendance>
            <Attendance>금</Attendance>
          </AttendanceBox>
        </HeadContent>
        {isAdmin && (
          <EditButton
            $active={isEditMode}
            onClick={(e) => {
              e.stopPropagation();
              setIsEditMode((prev) => !prev);
            }}
          >
            수정
          </EditButton>
        )}
      </Head>
      <ListWrapper $calendarHeight={calendarHeight}>
        {student.map((ele, index) => (
          <Children key={ele.id} style={getBorderStyle(index)}>
            <ChildrenContent $isEditMode={isEditMode && isAdmin}>
              {isEditMode && isAdmin && (
                <DeleteButton
                  onClick={() =>
                    handleDeleteStudent(ele.id, ele.name, ele.classId)
                  }
                >
                  X
                </DeleteButton>
              )}
              <Name $isBody={true}>{ele.name}</Name>
              <AttendanceBox>
                <Attendance color="#76c078">{ele.monday}</Attendance>
                <Attendance color="#76c078">{ele.tuesday}</Attendance>
                <Attendance color="#76c078">{ele.wednesday}</Attendance>
                <Attendance color="#76c078">{ele.thursday}</Attendance>
                <Attendance color="#76c078">{ele.friday}</Attendance>
              </AttendanceBox>
            </ChildrenContent>
          </Children>
        ))}
        {isAdmin && isSpecificClass && (
          <AddStudentRow>
            <AddStudentInput
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="학생 이름"
            />
            <AddStudentButton onClick={handleAddStudent} disabled={isAdding}>
              {isAdding ? "추가 중..." : "추가"}
            </AddStudentButton>
          </AddStudentRow>
        )}
      </ListWrapper>
    </ChildListWrapper>
  );
};

export default ChildList;
