import { useState } from "react";
import { useAllClassesQuery } from "../../hooks/useQuery";
import { useClassMutation } from "../../hooks/useClassMutation";
import { useToastStore } from "../../store/toastStore";
import {
  InputRow,
  Input,
  AddButton,
  TabContent,
  ListItem,
  ListItemName,
  EmptyMessage,
} from "./ManagementModal.styles";

const ClassTab = () => {
  const [className, setClassName] = useState("");
  const { data: classes = [] } = useAllClassesQuery();
  const { addClass, isLoading } = useClassMutation();
  const { show } = useToastStore();

  const handleAdd = () => {
    const trimmed = className.trim();
    if (!trimmed) return;

    const exists = classes.some((c: { id: string }) => c.id === trimmed);
    if (exists) {
      show("이미 존재하는 반 이름입니다.", "error");
      return;
    }

    addClass(trimmed);
    setClassName("");
  };

  return (
    <>
      <InputRow>
        <Input
          type="text"
          placeholder="반 이름"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <AddButton onClick={handleAdd} disabled={!className.trim() || isLoading}>
          추가
        </AddButton>
      </InputRow>
      <TabContent>
        {classes.length === 0 ? (
          <EmptyMessage>등록된 반이 없습니다.</EmptyMessage>
        ) : (
          classes.map((c: { id: string }) => (
            <ListItem key={c.id}>
              <ListItemName>{c.id}</ListItemName>
            </ListItem>
          ))
        )}
      </TabContent>
    </>
  );
};

export default ClassTab;
