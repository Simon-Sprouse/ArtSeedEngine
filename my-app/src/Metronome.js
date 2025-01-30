import { useRef, useState } from 'react'

import CircularQueue from './CircularQueue';

function Metronome({ parameters, setParameters }) { 


    // state controls UI input, ref is for the animation loop
    const [frequency, setFrequency] = useState(parameters.render.frequency);
    const frequencyRef = useRef(parameters.render.frequency);

    // for animation loop
    const intervalRef = useRef(null);
    const lastFrameTimeRef = useRef(0);
    const accumulatedTimeRef = useRef(0);
    const [pulseCount, setPulseCount] = useState(0);

    // for data storage
    const capacity = 100000
    const qRef = useRef(new CircularQueue(capacity));


    

    // loop function - will be called at async frequency
    function animate(callTime) { 

        const elpased = callTime - lastFrameTimeRef.current;
        lastFrameTimeRef.current = callTime;
        accumulatedTimeRef.current += elpased;

        const pulseInterval = 1000 / frequencyRef.current;
        const numPulses = Math.floor(accumulatedTimeRef.current / pulseInterval);

        pulse(numPulses);
        accumulatedTimeRef.current -= numPulses * pulseInterval;

        // summon next frame
        intervalRef.current = requestAnimationFrame(animate);

    }

    // run multiple pulses
    function pulse(numPulses) { 

        let localParameters = { ... parameters };

        for (let i = 0; i < numPulses; i++) { 
            localParameters = pulseHelper(localParameters);
        }
        setParameters(localParameters);
        setPulseCount(prev => prev + numPulses);
        
    }

    // run a single pulse
    function pulseHelper(localParameters) { 
       
        const newParameters = { ... localParameters }

        for (const [key, value] of Object.entries(localParameters.oscilators)) { 
            const newOscilatorPos = (value.pos + value.step) % 100;
            newParameters["oscilators"][key].pos = newOscilatorPos;

            for (const setting of value.attachedTo) { 
                const settingTraits = newParameters["settings"][setting];
                if (!settingTraits) continue;

                const range = settingTraits.rBound - settingTraits.lBound;
                const scaledPos = settingTraits.lBound + (newOscilatorPos / 100) * range;
                newParameters["settings"][setting].pos = scaledPos;
            }
        }

        const q = qRef.current;
        q.addState(getStateFromParameters());

        return newParameters;
    }

    // separate the state from seed and render
    function getStateFromParameters() { 
        const state = {}
        for (const [key, value] of Object.entries(parameters.settings)) { 
            // key: xPos
            // value: {pos, lbound ...}
            state[key] = value.pos;
        }
        for (const [key, value] of Object.entries(parameters.oscilators)) { 
            state[key] = value.pos;
        }
        // console.log("state: ", state);
        return state;
    }






    function startMetronome() { 
        if (intervalRef.current) return;
        lastFrameTimeRef.current = performance.now();
        intervalRef.current = requestAnimationFrame(animate);
        
    }

    function stopMetronome() { 
        if (intervalRef.current) { 
            cancelAnimationFrame(intervalRef.current);
            intervalRef.current = null;
        }
        accumulatedTimeRef.current = 0; // don't render leftover frames
    }

    function handleFrequencyChange(event) { 
        const newFrequency = Number(event.target.value);
        frequencyRef.current = newFrequency;
        setFrequency(newFrequency);

    }



    return (
        <div>
            <p>Pulse Count: {pulseCount}</p>
            <h1>Metronome</h1>
            <button onClick={startMetronome}>Play</button>
            <button onClick={stopMetronome}>Pause</button>
            <button onClick={() => {pulse(1)}}>Pulse</button>

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

            <button onClick={() => {console.log(qRef.current.getOnScreen())}}>Test OnScreen</button>
            <button onClick={() => {console.log(getStateFromParameters())}}>Get State</button>

        </div>
    )
}

export default Metronome;