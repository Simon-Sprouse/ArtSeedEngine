import { useState } from 'react';

import CustomRange from './CustomRange';
import Oscilator from './Oscilator';

function SideBar({ parameters, handleChange }) { 


   

    return (
        <div className="sideBar">

            <h1>Seed Engine</h1>

            <h2>Settings</h2>
            {Object.entries(parameters.settings).map(([dimension, traits]) => {
                // category: settings
                // dimensions: xPos, yPos, size ...
                // traits: {input, min, max, lBound, rBound, pos, ... scale ... }

                if (traits.input == "CustomRange") { 
                    return (
                        <div key={dimension} className="range-item">
                            <p>{dimension}</p>
                            <CustomRange 
                                oscilators={parameters.oscilators}
                                dimension={dimension}
                                min={traits.min}
                                max={traits.max}
                                lBound={traits.lBound}
                                rBound={traits.rBound}
                                pos={traits.pos}
                                handleChange={handleChange} // trait: lBound
                            />

                        </div>
                    )
                }
                return null;
            })}


            <h2>Oscilators</h2>
            {Object.entries(parameters.oscilators).map(([oscilator, traits]) => {
                // category: oscilators
                // oscilators: A, B ...
                // traits: {type, step, attachedTo, ... pos ... }

                // no if statement, I can assume all oscilators use the same component
                return (
                    <div key={oscilator} className="range-item">
                        <p>{oscilator}</p>
                        <Oscilator
                            pos={traits.pos}
                            onChange={(trait, newValue) => handleChange("oscilators", oscilator, trait, newValue)} // trait: lBound
                        />

                    </div>
                )

            })}





        </div>
    )
}

export default SideBar;