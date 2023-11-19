import "./App.css";
import Filters from "./components/Filters";

function App() {
  return (
    <>
      <div className="h-screen grid grid-cols-5">
        <div className="h-screen col-span-1">
          <Filters />
        </div>
        <div></div>
      </div>
    </>
  );
}

export default App;
