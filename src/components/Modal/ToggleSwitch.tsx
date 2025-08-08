import { StyledToggleSwitch } from "./AttendanceModal.styles";

interface Props {
  checked: boolean;
  onChange: () => void;
}

const ToggleSwitch = ({ checked, onChange }: Props) => (
  <StyledToggleSwitch $state={Number(!checked)}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span />
  </StyledToggleSwitch>
);

export default ToggleSwitch;
