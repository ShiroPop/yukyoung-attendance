import styled from "styled-components";
import { useClassesStore } from "../store/classesStore";
import { useEffect, useState } from "react";
import { getClassStudentsAttendance } from "../utils/getClassStudentsAttendance";
import { useSemesterStore } from "../store/semesterStore";

type Student = {
  id: string;
  name: string;
  classId: string;
};

type AttendanceSummary = {
  attendCount: number;
  absentCount: number;
  total: number;
};

type StudentAttendanceInfo = Student & AttendanceSummary;

const Head = styled.div`
  display: grid;
  justify-items: center;
  grid-template-columns: 2fr 1fr;
  background-color: #76c078;
  color: #fff;
  padding: 8px 30px;
`;

const Name = styled.div<{ isBody?: boolean }>`
  width: 100%;
  text-align: ${({ isBody }) => (isBody ? "left" : "")};
  color: ${({ isBody }) => (isBody ? "#76c078" : "#fff")};
  font-weight: ${({ isBody }) => (isBody ? "600" : "400")};
`;

const AttendanceBox = styled.div`
  display: flex;
`;

const Attendance = styled.span<{ color?: string }>`
  width: 30px;
  margin: 0 12px;
  color: ${({ color }) => (color ? color : "#fff")};
`;

const ListWrapper = styled.div`
  max-height: 350px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Children = styled.div`
  display: grid;
  justify-items: center;
  grid-template-columns: 2fr 1fr;
  padding: 12px 30px;
  border-bottom: 1px solid #cecece;
`;

const ChildList = () => {
  const { classId } = useClassesStore();
  const { semester } = useSemesterStore();

  const [student, setStudent] = useState<StudentAttendanceInfo[]>([]);

  useEffect(() => {
    if (!semester || !classId) return;
    getClassStudentsAttendance(semester, classId.id).then(setStudent);
  }, [classId]);

  return (
    <>
      <Head>
        <Name>이름</Name>
        <AttendanceBox>
          <Attendance>결석</Attendance>
          <Attendance>출석</Attendance>
          <Attendance>합계</Attendance>
        </AttendanceBox>
      </Head>
      <ListWrapper>
        {student.map((ele) => (
          <Children>
            <Name isBody={true}>{ele.name}</Name>
            <AttendanceBox>
              <Attendance color="#76c078">{ele.attendCount}</Attendance>
              <Attendance color="#CECECE">{ele.absentCount}</Attendance>
              <Attendance color="#76c078">{ele.total}</Attendance>
            </AttendanceBox>
          </Children>
        ))}
      </ListWrapper>
    </>
  );
};

export default ChildList;
