import { useState } from 'react';

import CustomRange from './CustomRange';
import Oscilator from './Oscilator';

function SideBar({ parameters, setParameters }) { 


    function handleChange(category, key, item, updatedValue) {

        setParameters(prevState => {

            // deep copy for immutability
            const newCategory = { ...prevState[category] };
            newCategory[key][item] = updatedValue
    
            // Return the new state
            return {
                ...prevState,
                [category]: newCategory,
            };
        });
    }

    return (
        <div className="sideBar">

            <h1>Seed Engine</h1>

            <h2>Settings</h2>
            {Object.entries(parameters.settings).map(([key, values]) => {
                // category: settings
                // keys: xPos, yPos, size ...
                // values: {input, min, max, lBound, rBound, pos, ... scale ... }

                if (values.input == "CustomRange") { 
                    return (
                        <div key={key} className="range-item">
                            <p>{key}</p>
                            <CustomRange 
                                min={values.min}
                                max={values.max}
                                lBound={values.lBound}
                                rBound={values.rBound}
                                pos={values.pos}
                                onChange={(updatedValues, item) => handleChange("settings", key, item, updatedValues)} // key: xPos, item: lBound
                            />
                        </div>
                    )
                };
            })}


            <h2>Oscilators</h2>
            {Object.entries(parameters.oscilators).map(([key, values]) => {
                // category: oscilators
                // keys: A, B ...
                // values: {type, step, attachedTo, ... pos ... }


                // no if statement, I can assume all oscilators use the same component
                return (
                    <div key={key} className="range-item">
                        <p>{key}</p>
                        <Oscilator
                            pos={values.pos}
                            onChange={(updatedValues, item) => handleChange("oscilators", key, item, updatedValues)} // key: xPos, item: lBound
                        />
                    </div>
                )

            })}





        </div>
    )
}

export default SideBar;