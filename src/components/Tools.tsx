import { useEffect } from "react";
import { randomId } from "../helpers";
import { WindowModel } from "../models/WindowModel";
import Test from "../shapes/Test";
import useAppStore from "../store";

const Tools = () => {

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

        setWindowModel(null);
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
        const newWindow = new WindowModel(randomId(), windowsHeight, windowsWidth, frameHeight, internalFrameHeight, horizontalSections, verticalSections, []);
        newWindow.editing = true;
        setWindowModel(newWindow);
    }


    const onFrameHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const frameHeight = Number(e.target.value);
        setFrameHeight(frameHeight);

        if (windowModel) {
            windowModel.frameHeight = frameHeight;
            windowModel.calcuateWindow();
            setWindowModel(windowModel.clone());
        }
    }

    const onInternalFrameHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const internalFrameHeight = Number(e.target.value);
        setInternalFrameHeight(internalFrameHeight);

        if (windowModel) {
            windowModel.internalFrameHeight = internalFrameHeight;
            windowModel.calcuateWindow();
            setWindowModel(windowModel.clone());
        }
    }

    const onHorizontalSectionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const horizontalSections = Number(e.target.value);
        setHorizontalSections(horizontalSections);

        if (windowModel) {
            windowModel.horizontalDivisions = horizontalSections;
            windowModel.calcuateWindow();
            setWindowModel(windowModel.clone());
        }
    }

    const onVerticalSectionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const verticalSections = Number(e.target.value);
        setVerticalSections(verticalSections);

        if (windowModel) {
            windowModel.verticalDivisions = verticalSections;
            windowModel.calcuateWindow();
            setWindowModel(windowModel.clone());
        }
    }




    return (
        <div className="h-full w-72 bg-gray-300 absolute top-0 flex flex-col items-center p-4">

            <div className="w-full">Mouse X:{mousePosition?.x ?? '-'} Y:{mousePosition?.y ?? '-'}</div>

            <button className="btn btn-blue mt-4 w-full" onClick={() => setWindowModel(null)}>Borrar</button>

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
                    <input className="btn w-full" type='number' min={1} max={30} value={frameHeight} onChange={onFrameHeightChange} />
                    <input className="ml-4 btn w-full" type='number' min={1} max={30} value={internalFrameHeight} onChange={onInternalFrameHeightChange} />
                </div>
            </div>
            <div className="mt-4 w-full flex flex-col">
                <label className="mr-2">Secciones horizontales</label>
                <input className="btn" type='number' min={1} max={10} value={horizontalSections} onChange={onHorizontalSectionsChange} />            </div>

            <div className="mt-4 w-full flex flex-col">
                <label className="mr-2">Secciones verticales</label>
                <input className="btn" type='number' min={1} max={10} value={verticalSections} onChange={onVerticalSectionsChange} />
            </div>

        </div>
    );
}

export default Tools;   