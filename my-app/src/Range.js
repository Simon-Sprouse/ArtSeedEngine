import { useState, useEffect } from 'react';
import './Range.css';

function Range({ min, max, lBound, rBound, pos, onChange }) {
    const [dragging, setDragging] = useState(null);
    const [sliderRect, setSliderRect] = useState(null);
    const [initialMousePos, setInitialMousePos] = useState(0);
    const [initialThumbPos, setInitialThumbPos] = useState(0);

    // Log function to help with debugging
    function logState() {
        console.log("lBound:", lBound, "rBound:", rBound, "pos:", pos);
    }

    function handleMouseDown(type, event) {
        setDragging(type);
        
        const rect = event.target.closest(".slider-container").getBoundingClientRect();
        setSliderRect(rect);
        setInitialMousePos(event.clientX);

        const thumbPosition = event.target.getBoundingClientRect().left - rect.left;
        setInitialThumbPos(thumbPosition);

        logState(); // Log to verify initial values
    }

    function handleMouseUp() {
        setDragging(null);
        setSliderRect(null);
        setInitialMousePos(0);
        setInitialThumbPos(0);
    }

    function handleMouseMove(event) {
        if (!dragging) return;

        const movement = event.clientX - initialMousePos;
        const newValue = min + ((movement + initialThumbPos) / sliderRect.width) * (max - min);

        if (dragging === "lBound") {
            const newLBound = Math.min(Math.max(newValue, min), rBound - 1);
            // Log before calling onChange to ensure it's firing
            console.log("Moving lBound:", newLBound);
            // onChange({ lBound: newLBound, pos: Math.max(pos, newLBound) });

            onChange(newLBound, "lBound");
            onChange(Math.max(pos, newLBound), "pos");



        } else if (dragging === "rBound") {
            const newRBound = Math.max(Math.min(newValue, max), lBound + 1);
            // Log before calling onChange to ensure it's firing
            console.log("Moving rBound:", newRBound);
            // onChange({ rBound: newRBound, pos: Math.min(pos, newRBound) });

            onChange(newRBound, "rBound");
            onChange(Math.min(pos, newRBound), "pos");


        } else if (dragging === "pos") {
            const newPos = Math.max(Math.min(newValue, rBound), lBound);
            // Log before calling onChange to ensure it's firing
            console.log("Moving pos:", newPos);
            // onChange({ pos: newPos });


            onChange(newPos, "pos");
        }

        logState(); // Log after each move to verify the update
    }

    useEffect(() => {
        if (dragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging]);

    function calculatePosition(value) {
        return ((value - min) / (max - min)) * 100;
    }

    return (
        <div className="slider-container">
            <div className="slider-track">
                {/* Left bound thumb */}
                <div
                    className="thumb lBound"
                    style={{ left: `${calculatePosition(lBound)}%` }}
                    onMouseDown={(event) => handleMouseDown('lBound', event)}
                >
                    <div className="thumb-value">
                        {Math.round(lBound)}
                    </div>
                </div>

                {/* Right bound thumb */}
                <div
                    className="thumb rBound"
                    style={{ left: `${calculatePosition(rBound)}%` }}
                    onMouseDown={(event) => handleMouseDown('rBound', event)}
                >
                    <div className="thumb-value">
                        {Math.round(rBound)}
                    </div>
                </div>

                {/* Pos thumb */}
                <div
                    className="thumb pos"
                    style={{ left: `${calculatePosition(pos)}%` }}
                    onMouseDown={(event) => handleMouseDown('pos', event)}
                >
                    <div className="thumb-value">
                        {Math.round(pos)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Range;
