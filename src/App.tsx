import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Calendar from "./layout/Calendar";
import ChildList from "./layout/ChildList";
import Classes from "./layout/Classes";
import Popup from "./layout/Popup";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
