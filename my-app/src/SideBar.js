import { useState } from 'react';
import Range from './Range';

function SideBar() { 



    const [sliderState, setSliderState] = useState({
        min: 0,
        max: 800,
        lBound: 0, 
        rBound: 800,
        pos: 420,
    });

    function updateSliderState(newState) { 
        setSliderState((prev) => ({...prev, ...newState}));
    }



    return (
        <div>
            <p>Controls Here</p>
            <Range 
                min={sliderState.min}
                max={sliderState.max}
                lBound={sliderState.lBound}
                rBound={sliderState.rBound}
                pos={sliderState.pos}
                onChange={updateSliderState}
            />
        </div>
    )
}

export default SideBar;