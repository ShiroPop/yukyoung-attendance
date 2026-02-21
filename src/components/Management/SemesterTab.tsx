import { useState } from "react";
import { useSemesterListQuery } from "../../hooks/useQuery";
import { useSemesterMutation } from "../../hooks/useSemesterMutation";
import { useSemesterStore } from "../../store/semesterStore";
import { useToastStore } from "../../store/toastStore";
import {
  InputRow,
  Input,
  AddButton,
  TabContent,
  ListItem,
  ListItemName,
  ActiveBadge,
  EmptyMessage,
} from "./ManagementModal.styles";

const SemesterTab = () => {
  const [startDate, setStartDate] = useState("");
  const { data: semesters = [] } = useSemesterListQuery();
  const { addSemester, isLoading } = useSemesterMutation();
  const { semester, setSemester } = useSemesterStore();
  const { show } = useToastStore();

  const handleAdd = () => {
    if (!startDate) return;

    const exists = semesters.some((s: { id: string }) => s.id === startDate);
    if (exists) {
      show("이미 존재하는 학기입니다.", "error");
      return;
    }

    addSemester(startDate);
    setStartDate("");
  };

  return (
    <>
      <InputRow>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <AddButton onClick={handleAdd} disabled={!startDate || isLoading}>
          추가
        </AddButton>
      </InputRow>
      <TabContent>
        {semesters.length === 0 ? (
          <EmptyMessage>등록된 학기가 없습니다.</EmptyMessage>
        ) : (
          semesters.map((s: { id: string }) => (
            <ListItem
              key={s.id}
              $active={s.id === semester}
              onClick={() => setSemester(s.id)}
            >
              <ListItemName>{s.id}</ListItemName>
              {s.id === semester && <ActiveBadge>선택됨</ActiveBadge>}
            </ListItem>
          ))
        )}
      </TabContent>
    </>
  );
};

export default SemesterTab;
