import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Calendar from "./layout/Calendar";
import ChildList from "./layout/ChildList";
import Classes from "./layout/Classes";
import AttendanceModal from "./components/Modal/AttendanceModal";
import SemesterModal from "./components/SemesterModal/SemesterModal";
import Login from "./layout/Login";
import { useUserStore } from "./store/userStore";
import { useSemesterStore } from "./store/semesterStore";
import Logout from "./layout/Logout";
import CalendarGuide from "./layout/CalendarGuide";
import styled from "styled-components";

const queryClient = new QueryClient();

const SemesterButton = styled.button`
  position: absolute;
  top: 6px;
  left: 7px;
  background: none;
  border: none;
  color: #76c078;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  padding: 2px 6px;
  transition: color 0.5s;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: #76c0784d;
    }
  }

  @media (min-width: 910px) {
    position: absolute;
    top: unset;
    left: 0px;
    bottom: 32px;
    font-size: 17px;
  }
`;

function App() {
  const { user } = useUserStore();
  const { openModal } = useSemesterStore();

  return (
    <QueryClientProvider client={queryClient}>
      {user?.role ? (
        <div className="App">
          <div className="Wrapper">
            <div>
              <Logout />
              {user.role === "admin" && (
                <SemesterButton onClick={openModal}>학기관리</SemesterButton>
              )}
              <Calendar />
              <CalendarGuide />
              <Classes />
            </div>
            <ChildList />
          </div>
        </div>
      ) : (
        <div className="App">
          <Login />
        </div>
      )}
      <AttendanceModal />
      <SemesterModal />
    </QueryClientProvider>
  );
}

export default App;
