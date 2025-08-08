import { StyledHolidayButton } from "./AttendanceModal.styles";

interface Props {
  isHoliday: boolean;
  onClick: () => void;
}

const HolidayButton = ({ isHoliday, onClick }: Props) => (
  <StyledHolidayButton onClick={onClick} $isHoliday={isHoliday}>
    휴일{isHoliday ? "삭제" : "등록"}
  </StyledHolidayButton>
);

export default HolidayButton;
