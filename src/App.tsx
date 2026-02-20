import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Calendar from "./layout/Calendar";
import ChildList from "./layout/ChildList";
import Classes from "./layout/Classes";
import AttendanceModal from "./components/Modal/AttendanceModal";
import ManagementModal from "./components/Management/ManagementModal";
import Login from "./layout/Login";
import { useUserStore } from "./store/userStore";
import Logout from "./layout/Logout";
import CalendarGuide from "./layout/CalendarGuide";
import SettingsButton from "./layout/SettingsButton";

const queryClient = new QueryClient();

function App() {
  const { user } = useUserStore();
  return (
    <QueryClientProvider client={queryClient}>
      {user?.role ? (
        <div className="App">
          <div className="Wrapper">
            <div>
              {user.role === "admin" && <SettingsButton />}
              <Logout />
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
      {user?.role === "admin" && <ManagementModal />}
    </QueryClientProvider>
  );
}

export default App;
