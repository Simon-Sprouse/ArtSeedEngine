import './App.css';
import SideBar from './SideBar';
import Canvas from './Canvas';

function App() {
  return (
    <div className="App">
    
        <div className="sidebar">
            <SideBar />
        </div>
        
        <div className="main-content">
            <Canvas />
        </div>

    </div>
  );
}

export default App;
