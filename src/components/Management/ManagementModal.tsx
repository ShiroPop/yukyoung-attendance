import { useManagementModalStore } from "../../store/managementModalStore";
import {
  ModalWrap,
  ModalBox,
  ModalHeader,
  CloseIcon,
  TabContainer,
  Tab,
} from "./ManagementModal.styles";
import SemesterTab from "./SemesterTab";
import ClassTab from "./ClassTab";
import StudentTab from "./StudentTab";

const ManagementModal = () => {
  const { isOpen, activeTab, closeModal, setActiveTab } =
    useManagementModalStore();

  return (
    <ModalWrap $isOpen={isOpen} onClick={closeModal}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <span />
          <CloseIcon onClick={closeModal} />
        </ModalHeader>
        <TabContainer>
          <Tab
            $active={activeTab === "semester"}
            onClick={() => setActiveTab("semester")}
          >
            학기
          </Tab>
          <Tab
            $active={activeTab === "class"}
            onClick={() => setActiveTab("class")}
          >
            반
          </Tab>
          <Tab
            $active={activeTab === "student"}
            onClick={() => setActiveTab("student")}
          >
            학생
          </Tab>
        </TabContainer>
        {activeTab === "semester" && <SemesterTab />}
        {activeTab === "class" && <ClassTab />}
        {activeTab === "student" && <StudentTab />}
      </ModalBox>
    </ModalWrap>
  );
};

export default ManagementModal;
