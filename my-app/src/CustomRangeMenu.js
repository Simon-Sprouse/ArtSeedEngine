import { useState, useEffect } from "react";

function CustomRangeMenu({ dimension, oscilators, handleChange }) {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOscillator, setSelectedOscillator] = useState("");

    // initialize with current Oscilator
    useEffect(() => {
        let found = false;
        for (const [key, oscillator] of Object.entries(oscilators)) {
            if (oscillator.attachedTo.includes(dimension)) {
                setSelectedOscillator(key);
                found = true;
                break;
            }
        }

        if (!found) { 
            setSelectedOscillator("None");
        }
    }, [dimension, oscilators]);


    const handleSelectChange = (event) => {

        // Remove the current dimension from the old oscilator
        if (selectedOscillator != "None") { 
            const attachedList = oscilators[selectedOscillator].attachedTo;
            const removedList = attachedList.filter(item => item !== dimension);
            handleChange("oscilators", selectedOscillator, "attachedTo", removedList);
        }
        
        

        // Add the current dimension to the new oscilator
        const selectedValue = event.target.value;
        setSelectedOscillator(selectedValue);

        if (selectedValue != "None") { 
            const listToModify = oscilators[selectedValue].attachedTo;
            const newList = [ ...listToModify, dimension ];
            handleChange("oscilators", selectedValue, "attachedTo", newList);
        }
        

    };

   

    return (
        <div>
            {!isOpen && (
                <div>
                    <button onClick={() => setIsOpen(true)}>Open Menu</button>
                </div>
            )}
            {isOpen && (
                <div>
                    <button onClick={() => setIsOpen(false)}>Close Menu</button>
                    <p>Attach Oscilator</p>
                    <select value={selectedOscillator} onChange={handleSelectChange}>
                        <option value="" disabled>Select an oscillator</option>
                        <option value="None">None</option>
                        {Object.keys(oscilators).map((key) => (
                            <option key={key} value={key}>
                                {key}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}

export default CustomRangeMenu;
