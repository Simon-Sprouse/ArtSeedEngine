import { useState } from 'react';
import Range from './Range';

import Parameters from './Parameters.json'

function SideBar() { 


    const [parameters, setParameters] = useState(Parameters);

    function handleChange(key, item, updatedValue) {
        console.log("Updating values for key: ", key, "item: ", item, updatedValue); // Debug log
        setParameters(prevState => {
            // Clone the current settings for immutability
            const updatedSettings = { ...prevState.settings };
    
            // Merge the updated values into the specified key
            updatedSettings[key][item] = updatedValue
    
            // Return the new state
            return {
                ...prevState,
                settings: updatedSettings,
            };
        });
    }



    return (
        <div className="sideBar">
            <h1>SideBar</h1>
            {Object.keys(parameters.settings).map(key => {
                const values = parameters.settings[key];


                if (values.input == "range") { 
                    return (
                        <div key={key} className="range-item">
                            <p>{key}</p>
                            <Range 
                                min={values.min}
                                max={values.max}
                                lBound={values.lBound}
                                rBound={values.rBound}
                                pos={values.pos}
                                onChange={(updatedValues, item) => handleChange(key, item, updatedValues)} // key: xPos, item: lBound
                            />
                        </div>
                    )
                };



            })}
        </div>
    )
}

export default SideBar;