import { useEffect } from "react";
import { randomId } from "../helpers";
import { WindowModel } from "../models/WindowModel";
import Test from "../shapes/Test";
import useAppStore from "../store";

const Tools = () => {
    const clearDrawings = useAppStore(state => state.clearDrawings);
    const addDrawing = useAppStore(state => state.addDrawing);

    const horizontalSections = useAppStore(state => state.horizontalSections);
    const verticalSections = useAppStore(state => state.verticalSections);
    const setHorizontalSections = useAppStore(state => state.setHorizontalSections);
    const setVerticalSections = useAppStore(state => state.setVerticalSections);
    const frameHeight = useAppStore(state => state.frameHeight);
    const setFrameHeight = useAppStore(state => state.setFrameHeight);
    const mousePosition = useAppStore(state => state.mousePosition);

    const windowsHeight = useAppStore(state => state.windowsHeight);
    const setWindowsHeight = useAppStore(state => state.setWindowsHeight);
    const windowsWidth = useAppStore(state => state.windowsWidth);
    const setWindowsWidth = useAppStore(state => state.setWindowsWidth);

    const internalFrameHeight = useAppStore(state => state.internalFrameHeight);
    const setInternalFrameHeight = useAppStore(state => state.setInternalFrameHeight);

    const windowModel = useAppStore(state => state.windowModel);
    const setWindowModel = useAppStore(state => state.setWindowModel);

    useEffect(() => { newSquareFrame(windowsHeight, windowsWidth) }, []);


    const newSquareFrame = (height: number, width: number) => {

        const points = [
            { x: -width / 2, y: -height / 2 },
            { x: width / 2, y: -height / 2 },
            { x: width / 2, y: height / 2 },
            { x: -width / 2, y: height / 2 },
        ];

        clearDrawings();
        //addDrawing(<Test key={randomId()} points={points} closed />);
        setWindowsHeight(height);
        setWindowsWidth(width);

        setWindowModel(new WindowModel(
            randomId(),
            windowsHeight,
            windowsWidth,
            frameHeight,
            internalFrameHeight,
            horizontalSections,
            verticalSections,
            points,
        ));
    }


    const freeDrawing = () => {
        clearDrawings();
    }


    return (
        <div className="h-full w-72 bg-gray-300 absolute top-0 flex flex-col items-center p-4">

            <div className="w-full">Mouse Position  X:{mousePosition?.x ?? '-'} Y:{mousePosition?.y ?? '-'}</div>

            <button className="btn btn-blue mt-4 w-full" onClick={() => clearDrawings()}>Borrar</button>

            <button className="btn btn-blue mt-2 w-full" onClick={() => newSquareFrame(windowsHeight, windowsWidth)}>Nueva ventana</button>

            <button className="btn btn-blue mt-2 w-full" onClick={() => freeDrawing()}>Dibujo libre</button>

            <div className="mt-4 w-full flex flex-col">
                <label className="mr-2">Altura ventana</label>
                <input className="btn" type='number' min={1} max={1000} value={windowsHeight} onChange={(e) => newSquareFrame(Number(e.target.value), windowsWidth)} />
            </div>
            <div className="mt-4 w-full flex flex-col">
                <label className="mr-2">Ancho ventana</label>
                <input className="btn" type='number' min={1} max={1000} value={windowsWidth} onChange={(e) => newSquareFrame(windowsHeight, Number(e.target.value))} />
            </div>
            <div className="mt-4 w-full flex flex-col">
                <label className="mr-2">Altura del marco</label>
                <div className="flex flex-row">
                    <input className="btn w-full" type='number' min={1} max={30} value={frameHeight} onChange={(e) => setFrameHeight(Number(e.target.value))} />
                    <input className="ml-4 btn w-full" type='number' min={1} max={30} value={internalFrameHeight} onChange={(e) => setInternalFrameHeight(Number(e.target.value))} />
                </div>
            </div>
            <div className="mt-4 w-full flex flex-col">
                <label className="mr-2">Divisiones horizontales</label>
                <input className="btn" type='number' min={1} max={30} value={horizontalSections} onChange={(e) => setHorizontalSections(Number(e.target.value))} />            </div>

            <div className="mt-4 w-full flex flex-col">
                <label className="mr-2">Divisiones verticales</label>
                <input className="btn" type='number' min={1} max={30} value={verticalSections} onChange={(e) => setVerticalSections(Number(e.target.value))} />
            </div>

        </div>
    );
}

export default Tools;   