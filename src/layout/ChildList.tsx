import styled from "styled-components";
import { useClassesStore } from "../store/classesStore";
import { useClassStudentsAttendance } from "../hooks/useClassStudentsAttendance";
import { useCalendarHeightStore } from "../store/calendarHeightStore";

const ChildListWrapper = styled.div`
  flex-shrink: 0;
  overflow-y: auto;
`;

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
  width: 24px;
  margin: 0 4px;
  color: ${({ color }) => (color ? color : "#fff")};
`;

const ListWrapper = styled.div<{ $calendarHeight: number }>`
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 110px - ${({ $calendarHeight }) => $calendarHeight}px);
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
  const { calendarHeight } = useCalendarHeightStore();

  const { data: student = [], isLoading } = useClassStudentsAttendance(classId.id);

  return (
    <ChildListWrapper>
      <Head>
        <Name>이름</Name>
        <AttendanceBox>
          <Attendance>월</Attendance>
          <Attendance>화</Attendance>
          <Attendance>수</Attendance>
          <Attendance>목</Attendance>
          <Attendance>금</Attendance>
        </AttendanceBox>
      </Head>
      <ListWrapper $calendarHeight={calendarHeight}>
        {student.map((ele) => (
          <Children key={ele.id}>
            <Name isBody={true}>{ele.name}</Name>
            <AttendanceBox>
              <Attendance color="#76c078">{ele.monday}</Attendance>
              <Attendance color="#76c078">{ele.tuesday}</Attendance>
              <Attendance color="#76c078">{ele.wednesday}</Attendance>
              <Attendance color="#76c078">{ele.thursday}</Attendance>
              <Attendance color="#76c078">{ele.friday}</Attendance>
            </AttendanceBox>
          </Children>
        ))}
      </ListWrapper>
    </ChildListWrapper>
  );
};

export default ChildList;
