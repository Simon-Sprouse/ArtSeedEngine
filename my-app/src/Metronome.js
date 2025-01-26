import { useRef, useState } from 'react'

function Metronome({ parameters, setParameters }) { 

    const [frequency, setFrequency] = useState(parameters.render.frequency);
    const intervalRef = useRef(null);



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





    function startMetronome() { 
        if (intervalRef.current) return;
        intervalRef.current = setInterval(pulse, 1000 / frequency);
    }

    function stopMetronome() { 
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }


    function handleFrequencyChange(event) { 
        const newFrequency = Number(event.target.value);
        setFrequency(newFrequency);
        if (intervalRef.current) { 
            stopMetronome();
            startMetronome();
        }
    }



    return (
        <div>
            <h1>Metronome</h1>
            <button onClick={startMetronome}>Play</button>
            <button onClick={stopMetronome}>Pause</button>
            <button onClick={pulse}>Pulse</button>

            <div>
                <label>Frequency (Hz): {frequency}
                    <input 
                        type="range"
                        min="1"
                        max="1000"
                        value={frequency}
                        onChange={handleFrequencyChange}
                    />
                </label>

            </div>

        </div>
    )
}

export default Metronome;