import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Calendar from "./layout/Calendar";
import ChildList from "./layout/ChildList";
import Classes from "./layout/Classes";
import AttendanceModal from "./layout/AttendanceModal";
import Login from "./layout/Login";
import { useUserStore } from "./store/userStore";
import Logout from "./layout/Logout";
import CalendarGuide from "./layout/CalendarGuide";

const queryClient = new QueryClient();

function App() {
  const { user } = useUserStore();
  return (
    <QueryClientProvider client={queryClient}>
      {user?.role ? (
        <div className="App">
          <div className="Wrapper">
            <div>
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
    </QueryClientProvider>
  );
}

export default App;
