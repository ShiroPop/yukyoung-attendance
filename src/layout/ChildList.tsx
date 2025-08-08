import styled from "styled-components";
import { useClassesStore } from "../store/classesStore";
import { useClassStudentsAttendance } from "../hooks/useClassStudentsAttendance";
import { useCalendarHeightStore } from "../store/calendarHeightStore";

const ChildListWrapper = styled.div`
  flex-shrink: 0;
  overflow-y: auto;
  flex: 1;
`;

const Head = styled.div`
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
  font-weight: ${({ $isBody }) => ($isBody ? "600" : "400")};
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
  height: calc(100dvh - 140px - ${({ $calendarHeight }) => $calendarHeight}px);
  height: calc(100vh - 140px - ${({ $calendarHeight }) => $calendarHeight}px);

  @media (min-width: 910px) {
    height: calc(100dvh - 40px);
    height: calc(100vh - 40px);
  }
`;

const Children = styled.div`
  width: 100%;
  border-bottom: 1px solid #cecece;
`;

const ChildrenContent = styled.div`
  display: grid;
  justify-items: end;
  grid-template-columns: 2fr 1fr;
  max-width: 600px;
  margin: 0 auto;
  padding: 12px 30px;
`;

const ChildList = () => {
  const { classId } = useClassesStore();
  const { calendarHeight } = useCalendarHeightStore();

  const { data: student = [] } = useClassStudentsAttendance(classId.id);

  return (
    <ChildListWrapper>
      <Head>
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
      </Head>
      <ListWrapper $calendarHeight={calendarHeight}>
        {student.map((ele) => (
          <Children key={ele.id}>
            <ChildrenContent>
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
      </ListWrapper>
    </ChildListWrapper>
  );
};

export default ChildList;
