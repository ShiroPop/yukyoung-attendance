import styled from "styled-components";

const Container = styled.div`
  border-top: 1px solid #00000030;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const ColorWrapper = styled.div`
  display: flex;
  padding: 8px 8px;
  align-items: center;
  gap: 4px;
`;

const Color = styled.div<{ $color: string }>`
  width: 16px;
  height: 16px;
  background-color: ${({ $color }) => $color};
  border: 1px solid #00000030;
  border-radius: 99px;
`;

const Text = styled.span`
  font-size: 13px;
`;

const CalendarGuide = () => {
  return (
    <Container>
      <ColorWrapper>
        <Color $color="#e2e2e2" />
        <Text>출석인원 없음</Text>
      </ColorWrapper>
      <ColorWrapper>
        <Color $color="none" />
        <Text>출석</Text>
      </ColorWrapper>
      <ColorWrapper>
        <Color $color="#FFB37D" />
        <Text>관리자 확인 필요</Text>
      </ColorWrapper>
      <ColorWrapper>
        <Color $color="#FF9696" />
        <Text>휴일</Text>
      </ColorWrapper>
    </Container>
  );
};

export default CalendarGuide;
