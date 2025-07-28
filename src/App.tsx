import "./App.css";
import Calendar from "./layout/Calendar";
import ChildList from "./layout/ChildList";
import Classes from "./layout/Classes";
import Popup from "./layout/Popup";
import Test from "./layout/Test";

function App() {
  return (
    <div className="App">
      <Calendar />
      <Classes />
      <ChildList />
      <Test />
      <Popup />
    </div>
  );
}

export default App;
