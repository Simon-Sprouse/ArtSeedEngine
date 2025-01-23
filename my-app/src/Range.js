import { useState, useEffect } from 'react';
import './Range.css';

function Range({ min, max, lBound, rBound, pos, onChange }) {
  
    const [dragging, setDragging] = useState(null);
    const [sliderRect, setSliderRect] = useState(null);
    const [initialMousePos, setInitialMousePos] = useState(0);
    const [initialThumbPos, setInitialThumbPos] = useState(0);

    function handleMouseDown(type, event) { 
        setDragging(type);

        const rect = event.target.closest(".slider-container").getBoundingClientRect();
        setSliderRect(rect);
        setInitialMousePos(event.clientX);

        const thumbPosition = event.target.getBoundingClientRect().left - rect.left;
        setInitialThumbPos(thumbPosition);
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
            onChange({ lBound: newLBound, pos: Math.max(pos, newLBound) });
        } else if (dragging === "rBound") {
            const newRBound = Math.max(Math.min(newValue, max), lBound + 1);
            onChange({ rBound: newRBound, pos: Math.min(pos, newRBound) });
        } else if (dragging === "pos") {
            const newPos = Math.max(Math.min(newValue, rBound), lBound);
            onChange({ pos: newPos });
        }

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
            <div
            className="thumb lBound"
            style={{ left: `${calculatePosition(lBound)}%` }}
            onMouseDown={(event) => handleMouseDown('lBound', event)}
            ></div>
            <div
            className="thumb rBound"
            style={{ left: `${calculatePosition(rBound)}%` }}
            onMouseDown={(event) => handleMouseDown('rBound', event)}
            ></div>
            <div
            className="thumb pos"
            style={{ left: `${calculatePosition(pos)}%` }}
            onMouseDown={(event) => handleMouseDown('pos', event)}
            ></div>
        </div>
        </div>
    );
}

export default Range;
