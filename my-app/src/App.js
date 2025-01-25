import { useState } from "react";
import './App.css';


import Parameters from './Parameters.json'

import SideBar from './SideBar';
import Canvas from './Canvas';
import Metronome from "./Metronome";


function App() {

    const [parameters, setParameters] = useState(Parameters);

    return (
        <div className="App">
        
            <div className="sidebar">
                <SideBar parameters={parameters} setParameters={setParameters}/>
            </div>
            
            <div className="main-content">
                <Canvas parameters={parameters} setParameters={setParameters}/>
                <Metronome />






                {/* SEED */}
                <h1>SEED</h1>
                <p>{parameters.engine}</p>
                {Object.entries(parameters.settings).map(([key, values]) => (
                    <p>
                        {key + " "} 
                        {values.lBound + " "}
                        {values.rBound + " "}
                        {values.scale + " "} 
                    </p>
                ))}
                {Object.entries(parameters.oscilators).map(([key, values]) => (
                    <p>
                        {key + " "} 
                        {values.type + " "}
                        {values.step + " "}
                        {JSON.stringify(values.attatchedTo, null,  2)}
                    </p>
                ))}


                {/* STATE */}
                <h1>STATE</h1>
                {Object.entries(parameters.settings).map(([key, values]) => (
                    <p>{key}: {values.pos}</p>
                ))}
                {Object.entries(parameters.oscilators).map(([key, values]) => (
                    <p>{key}: {values.pos}</p>
                ))}


            </div>
        </div>
    );
}

export default App;
