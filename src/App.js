import logo from "./logo.svg";
import "./App.css";
import Sidebar from "./components/Sidebar";
import MapComponent from "./components/MapComponent";

function App() {
  return (
    <div className="App">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="map">
        <MapComponent />
      </div>
    </div>
  );
}

export default App;
