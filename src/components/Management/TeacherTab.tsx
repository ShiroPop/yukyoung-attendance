import { useState } from "react";
import { useTeachersQuery, useTeacherDetailQuery } from "../../hooks/useTeacherQuery";
import { useTeacherMutation } from "../../hooks/useTeacherMutation";
import { useAllClassesQuery } from "../../hooks/useQuery";
import {
  Select,
  TabContent,
  EmptyMessage,
  CheckboxLabel,
} from "./ManagementModal.styles";

const TeacherTab = () => {
  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  const { data: teachers = [] } = useTeachersQuery();
  const { data: teacherDetail } = useTeacherDetailQuery(selectedTeacherId);
  const { data: classes = [] } = useAllClassesQuery();
  const { assignClass, unassignClass, isLoading } = useTeacherMutation();

  const assignedClasses = teacherDetail?.assigned_classes ?? [];

  const handleToggle = (className: string, isAssigned: boolean) => {
    if (isLoading) return;
    if (isAssigned) {
      unassignClass(selectedTeacherId, className);
    } else {
      assignClass(selectedTeacherId, className);
    }
  };

  return (
    <>
      <Select
        value={selectedTeacherId}
        onChange={(e) => setSelectedTeacherId(e.target.value)}
      >
        <option value="">선생님을 선택하세요</option>
        {teachers.map((t) => (
          <option key={t.id} value={t.id}>
            {t.id}
          </option>
        ))}
      </Select>
      <TabContent>
        {!selectedTeacherId ? (
          <EmptyMessage>선생님을 선택하세요.</EmptyMessage>
        ) : classes.length === 0 ? (
          <EmptyMessage>등록된 반이 없습니다.</EmptyMessage>
        ) : (
          classes.map((c: { id: string }) => {
            const isAssigned = assignedClasses.includes(c.id);
            return (
              <CheckboxLabel key={c.id}>
                <input
                  type="checkbox"
                  checked={isAssigned}
                  onChange={() => handleToggle(c.id, isAssigned)}
                  disabled={isLoading}
                />
                {c.id}
              </CheckboxLabel>
            );
          })
        )}
      </TabContent>
    </>
  );
};

export default TeacherTab;
