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

    // for circular queue
    const capacity = 100000
    const qRef = useRef(new CircularQueue(capacity));


    /*
        FORWARD ANIMATION LOOP
        ----------------------

        function: getStateFromParameters
            - separates the state from the parameters

        function: pulse
            - the atomic unit
            - moves the oscilators
            - calls getStateFromParameters
            - saves the current state in Q

        function: pulseMultiple
            - stores local parameters
            - calls pulse k times

        function: Animate:
            - maintains time accumulator
            - calculates num pulses for this animation loop
            - calls for a render 
    */


    function getStateFromParameters() { 
        const state = {
            settings: {},
            oscilators: {}
        }
        for (const [key, value] of Object.entries(parameters.settings)) { 
            // key: xPos
            // value: {pos, lbound ...}
            state["settings"][key] = value.pos;
        }
        for (const [key, value] of Object.entries(parameters.oscilators)) { 
            state["oscilators"][key] = value.pos;
        }
        // console.log("state: ", state);
        return state;
    }
    

    function pulse(localParameters) { 

       
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

    
    function pulseMultiple(numPulses) { 

        let localParameters = { ... parameters };

        for (let i = 0; i < numPulses; i++) { 
            localParameters = pulse(localParameters);
        }

        setParameters(localParameters);
        setPulseCount(prev => prev + numPulses);
        
    }


    function animate(callTime) { 

        const elpased = callTime - lastFrameTimeRef.current;
        lastFrameTimeRef.current = callTime;
        accumulatedTimeRef.current += elpased;

        const pulseInterval = 1000 / frequencyRef.current;
        const numPulses = Math.floor(accumulatedTimeRef.current / pulseInterval);

        pulseMultiple(numPulses);
        accumulatedTimeRef.current -= numPulses * pulseInterval;


        // TODO: Call the rendering function!!!







        // summon next frame
        intervalRef.current = requestAnimationFrame(animate);

    }







    /*
        BACKWARD ANIMATION LOOP
        ----------------------

        function: getParametersFromState
            - builds parameters with updated state

        function: undoMultiple
            - moves Q pointers back k elements
            - gets last state from Q
            - calls getParametersFromState

        function: animateReverse:
            - maintains time accumulator
            - calculates num undos for this animation loop
            - calls for a render 
    */


    function getParametersFromState(state) { 

        const settings = JSON.parse(JSON.stringify(parameters.settings));
        const oscilators = JSON.parse(JSON.stringify(parameters.oscilators));


        for (const [key, value] of Object.entries(state.settings)) { 
            settings[key].pos = value
        }
        for (const [key, value] of Object.entries(state.oscilators)) { 
            oscilators[key].pos = value
        }

        const newParameters = {
            ...parameters,
            settings: settings, 
            oscilators: oscilators
        }

        return newParameters;

    }

    function undoMultiple(numUndos) { 

        // take the 2nd-to-last state from queue
        const q = qRef.current; 
        const lastState = q.undoMultiple(numUndos);

        // use saved state to adjust positions
        const newParameters = getParametersFromState(lastState);
        setPulseCount(prev => Math.max(0, prev - numUndos));
        setParameters(newParameters);

    }


    function animateReverse(callTime) { 
        

        const elpased = callTime - lastFrameTimeRef.current;
        lastFrameTimeRef.current = callTime;
        accumulatedTimeRef.current += elpased;

        const pulseInterval = 1000 / frequencyRef.current;
        const numPulses = Math.floor(accumulatedTimeRef.current / pulseInterval);

        undoMultiple(numPulses);
        accumulatedTimeRef.current -= numPulses * pulseInterval;


        // TODO: Call the rendering function!!!







        // summon next frame
        intervalRef.current = requestAnimationFrame(animateReverse);

    }





















    // called by start, stop, and reverse
    function clearInterval() { 
        if (intervalRef.current) { 
            cancelAnimationFrame(intervalRef.current);
            intervalRef.current = null;
        }
    }



    function startMetronome() { 

        clearInterval();
        lastFrameTimeRef.current = performance.now();
        intervalRef.current = requestAnimationFrame(animate);
        
    }

    function stopMetronome() { 
        
        clearInterval();
        accumulatedTimeRef.current = 0; // don't render leftover frames
    }


    function reverseMetronome() { 

        clearInterval();
        lastFrameTimeRef.current = performance.now();
        intervalRef.current = requestAnimationFrame(animateReverse);

    }



    function handleFrequencyChange(event) { 
        const newFrequency = Number(event.target.value);
        frequencyRef.current = newFrequency;
        setFrequency(newFrequency);

    }



    return (
        <div>
            <h1>Metronome</h1>
            
            
            <button onClick={startMetronome}>Play</button>
            <button onClick={stopMetronome}>Pause</button>
            <button onClick={reverseMetronome}>Reverse</button>
            <button onClick={() => {pulseMultiple(1)}}>Pulse</button>
            <button onClick={() => {undoMultiple(1)}}>Undo</button>


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

            <p>Pulse Count: {pulseCount}</p>
            <button onClick={() => {console.log(qRef.current.getOnScreen())}}>Test OnScreen</button>
            <button onClick={() => {console.log(getStateFromParameters())}}>Get State</button>

        </div>
    )
}

export default Metronome;