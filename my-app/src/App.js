import { useState } from "react";
import './App.css';


import Parameters from './Parameters.json'

import SideBar from './SideBar';
import Canvas from './Canvas';


function App() {

    const [parameters, setParameters] = useState(Parameters);

    return (
        <div className="App">
        
            <div className="sidebar">
                <SideBar parameters={parameters} setParameters={setParameters}/>
            </div>
            
            <div className="main-content">
                <Canvas parameters={parameters} setParameters={setParameters}/>
            </div>

        </div>
    );
}

export default App;
