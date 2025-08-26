import Toast from "../Toast";
import { AttendanceInfo } from "./AttendanceModal";
import { ChildrenList } from "./AttendanceModal.styles";
import ToggleSwitch from "./ToggleSwitch";

interface Props {
  attendances: AttendanceInfo[];
  onToggle: (id: string, newState: number) => void;
}

const AttendanceList = ({ attendances, onToggle }: Props) => {
  const getBorderStyle = (index: number) => {
    const ele = attendances[index];
    const prev = index > 0 ? attendances[index - 1] : undefined;
    const next = index < attendances.length - 1 ? attendances[index + 1] : undefined;

    const isTeacher = ele.id.includes("teacher");
    const prevIsTeacher = prev?.id.includes("teacher");
    const nextIsTeacher = next?.id.includes("teacher");

    if (isTeacher) {
      return {
        borderTop: prevIsTeacher ? "1px solid #bbb" : "1px solid #bbb",
        borderBottom: nextIsTeacher ? "none" : "1px solid #bbb",
        fontWeight: isTeacher ? "600" : "500",
        color: isTeacher ? "#76c078" : "black",
      } as React.CSSProperties;
    }

    return {
      borderBottom: nextIsTeacher ? "none" : "1px dashed #cecece",
    } as React.CSSProperties;
  };

  return (
    <>
      {attendances.map((ele, index) => (
        <ChildrenList key={ele.id} style={getBorderStyle(index)}>
          <div>{ele.name}</div>
          <ToggleSwitch checked={ele.state === 0} onChange={() => onToggle(ele.id, Number(!ele.state))} />
        </ChildrenList>
      ))}
      <Toast />
    </>
  );
};

export default AttendanceList;
