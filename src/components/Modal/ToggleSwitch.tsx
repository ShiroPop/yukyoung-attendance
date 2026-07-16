import { StyledToggleSwitch } from "./AttendanceModal.styles";

interface Props {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

const ToggleSwitch = ({ checked, onChange, disabled = false }: Props) => (
  <StyledToggleSwitch $state={Number(!checked)} $disabled={disabled}>
    <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
    <span />
  </StyledToggleSwitch>
);

export default ToggleSwitch;
