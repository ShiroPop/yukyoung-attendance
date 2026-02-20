import { useState } from "react";
import { useSemesterStore } from "../../store/semesterStore";
import { useSemesterListQuery } from "../../hooks/useQuery";
import { useSemesterMutation } from "../../hooks/useSemesterMutation";
import { useToastStore } from "../../store/toastStore";
import {
  ModalWrap,
  ModalBox,
  CloseIcon,
  AddRow,
  DateInput,
  AddButton,
  ListWrap,
  SemesterItem,
} from "./SemesterModal.styles";

const SemesterModal = () => {
  const { semester, setSemester, isModalOpen, closeModal } = useSemesterStore();
  const { data: semesters = [] } = useSemesterListQuery();
  const semesterMutation = useSemesterMutation();
  const { show } = useToastStore();

  const [newDate, setNewDate] = useState("");

  const handleAdd = () => {
    if (!newDate) return;
    if (semesters.some((sem: { id: string }) => sem.id === newDate)) {
      show("이미 존재하는 학기입니다.", "error");
      return;
    }
    semesterMutation.mutate(newDate, {
      onSuccess: () => setNewDate(""),
    });
  };

  const handleSelect = (id: string) => {
    setSemester(id);
    closeModal();
  };

  return (
    <ModalWrap $isModal={isModalOpen} onClick={closeModal}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <CloseIcon onClick={closeModal} />
        <AddRow>
          <DateInput type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
          <AddButton onClick={handleAdd}>추가</AddButton>
        </AddRow>
        <ListWrap>
          {semesters
            .sort((a: { id: string }, b: { id: string }) => b.id.localeCompare(a.id))
            .map((sem: { id: string }) => (
              <SemesterItem key={sem.id} $active={sem.id === semester} onClick={() => handleSelect(sem.id)}>
                {sem.id}
              </SemesterItem>
            ))}
        </ListWrap>
      </ModalBox>
    </ModalWrap>
  );
};

export default SemesterModal;
