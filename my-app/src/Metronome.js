import { useState } from 'react'

function Metronome({ parameters, setParameters }) { 





    function pulse() { 
        // Path 1: handle onScreen + render

        // Path 2: handle oscilators

        // deep copy
        const newParameters = { ...parameters };

        for (const [oscilator, traits] of Object.entries(parameters.oscilators)) { 
            const newOscilatorPos = (traits.pos + traits.step) % 100;
            newParameters["oscilators"][oscilator].pos = newOscilatorPos;

            for (const dimension of traits.attachedTo) { 
                const settingTraits = newParameters["settings"][dimension];
                if (!settingTraits) continue;

                const range = settingTraits.rBound - settingTraits.lBound;
                const scaledPos = settingTraits.lBound + (newOscilatorPos / 100) * range;
                newParameters["settings"][dimension].pos = scaledPos;
            }
        }

        setParameters(newParameters);


    }



    return (
        <div>
            <h1>Metronome</h1>
            <button onClick={pulse}>Pulse</button>
        </div>
    )
}

export default Metronome;