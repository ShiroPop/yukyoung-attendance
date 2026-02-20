import { useState } from "react";
import { useAllClassesQuery, useStudentsQuery } from "../../hooks/useQuery";
import { useStudentMutation } from "../../hooks/useStudentMutation";
import {
  InputRow,
  Input,
  AddButton,
  TabContent,
  ListItem,
  ListItemName,
  DeleteButton,
  Select,
  EmptyMessage,
} from "./ManagementModal.styles";

const StudentTab = () => {
  const [selectedClassId, setSelectedClassId] = useState("");
  const [studentName, setStudentName] = useState("");

  const { data: classes = [] } = useAllClassesQuery();
  const { data: students = [] } = useStudentsQuery(selectedClassId);
  const { addStudent, deleteStudent, isAddLoading } = useStudentMutation();

  const handleAdd = () => {
    const trimmed = studentName.trim();
    if (!trimmed || !selectedClassId) return;

    addStudent(trimmed, selectedClassId);
    setStudentName("");
  };

  const handleDelete = (studentId: string, name: string) => {
    if (!window.confirm(`"${name}" 학생을 삭제하시겠습니까?`)) return;
    deleteStudent(studentId, selectedClassId);
  };

  return (
    <>
      <Select
        value={selectedClassId}
        onChange={(e) => setSelectedClassId(e.target.value)}
      >
        <option value="">반을 선택하세요</option>
        {classes.map((c: { id: string }) => (
          <option key={c.id} value={c.id}>
            {c.id}
          </option>
        ))}
      </Select>
      {selectedClassId && (
        <InputRow>
          <Input
            type="text"
            placeholder="학생 이름"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <AddButton
            onClick={handleAdd}
            disabled={!studentName.trim() || isAddLoading}
          >
            추가
          </AddButton>
        </InputRow>
      )}
      <TabContent>
        {!selectedClassId ? (
          <EmptyMessage>반을 선택하세요.</EmptyMessage>
        ) : students.length === 0 ? (
          <EmptyMessage>등록된 학생이 없습니다.</EmptyMessage>
        ) : (
          students.map((s: { id: string; name: string }) => (
            <ListItem key={s.id}>
              <ListItemName>{s.name}</ListItemName>
              <DeleteButton onClick={() => handleDelete(s.id, s.name)}>
                삭제
              </DeleteButton>
            </ListItem>
          ))
        )}
      </TabContent>
    </>
  );
};

export default StudentTab;
