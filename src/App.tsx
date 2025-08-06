import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Calendar from "./layout/Calendar";
import ChildList from "./layout/ChildList";
import Classes from "./layout/Classes";
import Popup from "./layout/Popup";
import Login from "./layout/Login";
import { useUserStore } from "./store/userStore";
import Logout from "./layout/Logout";

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
              <Classes />
            </div>
            <ChildList />
          </div>
          <Popup />
        </div>
      ) : (
        <div className="App">
          <Login />
        </div>
      )}
    </QueryClientProvider>
  );
}

export default App;
