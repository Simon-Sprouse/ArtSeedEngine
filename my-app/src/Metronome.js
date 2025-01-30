import { useRef, useState } from 'react'

import CircularQueue from './CircularQueue';

function Metronome({ parameters, setParameters }) { 

    const [frequency, setFrequency] = useState(parameters.render.frequency);
    const intervalRef = useRef(null);

    const lastFrameTimeRef = useRef(0);
    const accumulatedTimeRef = useRef(0);
    

    const capacity = 100000
    const qRef = useRef(new CircularQueue(capacity));

    const [pulseCount, setPulseCount] = useState(0);


    function animate(callTime) { 

        
        if (lastFrameTimeRef.current == 0) { 
            lastFrameTimeRef.current = callTime;
        }
    
        const elpased = callTime - lastFrameTimeRef.current;
        lastFrameTimeRef.current = callTime;


        accumulatedTimeRef.current += elpased;

        const pulseInterval = 1000 / frequency;
        const numPulses = Math.floor(accumulatedTimeRef.current / pulseInterval);

        if (numPulses > 0) { 
            for (let i = 0; i < numPulses; i++) { 
                pulse();
            }
            accumulatedTimeRef.current -= numPulses * pulseInterval;
        }


        // summon next frame
        intervalRef.current = requestAnimationFrame(animate);






    }


    function pulse() { 
       



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





        const q = qRef.current;
        q.addState(getStateFromParameters());

        setPulseCount(prev => prev + 1);

    }













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
        setFrequency(newFrequency);
    }



    return (
        <div>
            <p>Pulse Count: {pulseCount}</p>
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

            <button onClick={() => {console.log(qRef.current.getOnScreen())}}>Test OnScreen</button>
            <button onClick={() => {console.log(getStateFromParameters())}}>Get State</button>

        </div>
    )
}

export default Metronome;