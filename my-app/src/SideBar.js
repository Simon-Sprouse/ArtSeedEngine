import { useState } from 'react';
import CustomRange from './CustomRange';

import Parameters from './Parameters.json'

function SideBar() { 


    const [parameters, setParameters] = useState(Parameters);

    function handleChange(key, item, updatedValue) {

        setParameters(prevState => {

            // deep copy for immutability
            const newSettings = { ...prevState.settings };
            newSettings[key][item] = updatedValue
    
            // Return the new state
            return {
                ...prevState,
                settings: newSettings,
            };
        });
    }



    return (
        <div className="sideBar">
            <h1>Seed Engine</h1>
            {Object.keys(parameters.settings).map(key => {
                // keys: xPos, yPos, size ...
                // values: {input, min, max, lBound, rBound, pos, ... scale ...}
                const values = parameters.settings[key];


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