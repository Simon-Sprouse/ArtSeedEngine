import { useRef, useEffect } from "react";

function Canvas({ parameters, setParameters }) {

    const canvasRef = useRef(null);

    useEffect(() => { 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);



    return (
        <div>
            <h1>Stats</h1>
            <canvas ref={canvasRef} width="800" height="400" />

            {/* SEED */}
            <h1>SEED</h1>
            <p>{parameters.engine}</p>
            {Object.entries(parameters.settings).map(([key, values]) => (
                <p>
                    {key + " "} 
                    {values.lBound + " "}
                    {values.rBound + " "}
                    {values.scale + " "} 
                </p>
            ))}
            {Object.entries(parameters.oscilators).map(([key, values]) => (
                <p>
                    {key} 
                    {JSON.stringify(values.movement, null, 2)}
                </p>
            ))}


            {/* STATE */}
            <h1>STATE</h1>
            {Object.entries(parameters.settings).map(([key, values]) => (
                <p>{key}: {values.pos}</p>
            ))}
            {Object.entries(parameters.oscilators).map(([key, values]) => (
                <p>{key}: {values.pos}</p>
            ))}



        </div>
    )
}

export default Canvas;