import { useRef, useEffect } from "react";

function Canvas({ parameters }) {

    const canvasRef = useRef(null);

    useEffect(() => { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);



    return (
        <div>
            <h1>Canvas</h1>
            <canvas ref={canvasRef} width="800" height="400" />

            



        </div>
    )
}

export default Canvas;