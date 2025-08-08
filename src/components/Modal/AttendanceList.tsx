import { AttendanceInfo } from "./AttendanceModal";
import { ChildrenList } from "./AttendanceModal.styles";
import ToggleSwitch from "./ToggleSwitch";

interface Props {
  attendances: AttendanceInfo[];
  onToggle: (id: string, newState: number) => void;
}

const AttendanceList = ({ attendances, onToggle }: Props) => {
  return (
    <>
      {attendances.map((ele) => (
        <ChildrenList key={ele.id}>
          <div>{ele.name}</div>
          <ToggleSwitch checked={ele.state === 0} onChange={() => onToggle(ele.id, Number(!ele.state))} />
        </ChildrenList>
      ))}
    </>
  );
};

export default AttendanceList;
