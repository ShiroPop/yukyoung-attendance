import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Calendar from "./layout/Calendar";
import ChildList from "./layout/ChildList";
import Classes from "./layout/Classes";
import Popup from "./layout/Popup";
import Login from "./layout/Login";
import { useUserStore } from "./store/userStore";

const queryClient = new QueryClient();

function App() {
  const { user } = useUserStore();

  return (
    <QueryClientProvider client={queryClient}>
      {user?.role ? (
        <div className="App">
          <div className="Wrapper">
            <div>
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
