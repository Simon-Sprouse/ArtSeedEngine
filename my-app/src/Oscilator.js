import { useState, useEffect } from 'react';
import './Range.css';

function Oscillator({ pos, onChange }) {

    const min = 0;
    const max = 100;

    const [dragging, setDragging] = useState(false);
    const [sliderRect, setSliderRect] = useState(null);
    const [initialMousePos, setInitialMousePos] = useState(0);
    const [initialThumbPos, setInitialThumbPos] = useState(0);

    function handleMouseDown(event) {
        setDragging(true);
        const rect = event.target.closest('.slider-container').getBoundingClientRect();
        setSliderRect(rect);
        setInitialMousePos(event.clientX);

        const thumbPosition = event.target.getBoundingClientRect().left - rect.left;
        setInitialThumbPos(thumbPosition);
    }

    function handleMouseUp() {
        setDragging(false);
        setSliderRect(null);
        setInitialMousePos(0);
        setInitialThumbPos(0);
    }

    function handleMouseMove(event) {
        if (!dragging) return;

        const movement = event.clientX - initialMousePos;
        const newValue = min + ((movement + initialThumbPos) / sliderRect.width) * (max - min);

        const newPos = Math.max(Math.min(newValue, max), min);
        onChange("pos", newPos);
    }

    // allow free-drag across document
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
                    className="thumb pos"
                    style={{ left: `${calculatePosition(pos)}%` }}
                    onMouseDown={handleMouseDown}
                >
                    <div className="thumb-value">{Math.round(pos)}</div>
                </div>
            </div>
        </div>
    );
}

export default Oscillator;
