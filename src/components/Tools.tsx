import React from 'react';
import logo from '../img/logo_mapplics.png';

import { useEffect } from "react";
import { randomId } from "../helpers";
import { IWindowComponent, WindowComponentType } from "../interfaces";
import { WindowModel } from "../models/WindowModel";
import useAppStore from "../store";

const Tools = () => {

    const horizontalSections = useAppStore(state => state.horizontalSections);
    const verticalSections = useAppStore(state => state.verticalSections);
    const setHorizontalSections = useAppStore(state => state.setHorizontalSections);
    const setVerticalSections = useAppStore(state => state.setVerticalSections);
    const frameHeight = useAppStore(state => state.frameHeight);
    const setFrameHeight = useAppStore(state => state.setFrameHeight);

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

    const externalSides = windowModel?.components.filter(c => c.type === WindowComponentType.EXTERNAL_SIDE);
    const internalSides = windowModel?.components.filter(c => c.type === WindowComponentType.INTERNAL_SIDE);
    const verticalCrossbars = windowModel?.components.filter(c => c.type === WindowComponentType.VERTICAL_CROSSBAR);
    const horizontalCrossbars = windowModel?.components.filter(c => c.type === WindowComponentType.HORIZONTAL_CROSSBAR);
    const glasses = windowModel?.components.filter(c => c.type === WindowComponentType.GLASS);

    return (
        <div className="h-full w-72 bg-gray-300 absolute top-0 flex flex-col items-center p-4">

            <img className="w-full" src={logo}/>

            <button className="btn btn-blue mt-6 w-full" onClick={() => setWindowModel(null)}>Borrar</button>

            {/* <button className="btn btn-blue mt-2 w-full" onClick={() => freeDrawing()}>Dibujo libre</button> */}

            <button className="btn btn-blue mt-2 w-full" onClick={() => newSquareFrame(windowsHeight, windowsWidth)}>Nueva ventana</button>


            <div className="mt-6  w-full flex flex-col">
                <label className="font-semibold">Dimensiones ventana</label>
                <div className="flex flex-row">
                    <div className="w-full flex flex-col">

                        <label className="text-gray-500">Alto</label>
                        <input className="btn" type='number' min={1} max={1000} value={windowsHeight} onChange={(e) => newSquareFrame(Number(e.target.value), windowsWidth)} />
                    </div>

                    <div className="ml-4 w-full flex flex-col">

                        <label className="text-gray-500">Ancho</label>
                        <input className="btn" type='number' min={1} max={1000} value={windowsWidth} onChange={(e) => newSquareFrame(windowsHeight, Number(e.target.value))} />
                    </div>
                </div>
            </div>

            <div className="mt-4 w-full flex flex-col">
                <label className="font-semibold">Alturas del marco</label>
                <div className="flex flex-row">
                    <input className="btn w-full" type='number' min={1} max={30} value={frameHeight} onChange={onFrameHeightChange} />
                    <input className="ml-4 btn w-full" type='number' min={1} max={30} value={internalFrameHeight} onChange={onInternalFrameHeightChange} />
                </div>
            </div>

            <div className="mt-4 w-full flex flex-col">
                <label className="font-semibold">Secciones</label>
                <div className="flex flex-row">
                    <div className="w-full flex flex-col">

                        <label className="text-gray-500"> Horizontales</label>
                        <input className="btn" type='number' min={1} max={10} value={horizontalSections} onChange={onHorizontalSectionsChange} />
                    </div>

                    <div className="ml-4 w-full flex flex-col">

                        <label className="text-gray-500">Verticales</label>
                        <input className="btn" type='number' min={1} max={10} value={verticalSections} onChange={onVerticalSectionsChange} />
                    </div>
                </div>
            </div>

            {
                windowModel?.components && windowModel.components.length > 0 &&
                <div className="mt-6 w-full flex flex-col overflow-y-hidden">
                    <label className="mb-2 font-semibold w-full">Componentes</label>

                    <div className="flex flex-col overflow-y-auto">
                        {
                            externalSides && externalSides.length > 0 &&
                            <div>
                                <div className="font-semibold">Lados exteriores</div>
                                {externalSides.map((component) => <WindowComponent key={component.id} component={component} />)}
                            </div>
                        }

                        {
                            internalSides && internalSides.length > 0 &&
                            <div>
                                <div className="font-semibold mt-1">Lados internos</div>
                                {internalSides.map((component) => <WindowComponent key={component.id} component={component} />)}
                            </div>
                        }

                        {
                            verticalCrossbars && verticalCrossbars.length > 0 &&
                            <div>
                                <div className="font-semibold mt-1">Travesaños verticales</div>
                                {verticalCrossbars.map((component) => <WindowComponent key={component.id} component={component} />)}
                            </div>
                        }


                        {
                            horizontalCrossbars && horizontalCrossbars.length > 0 &&
                            <div>
                                <div className="font-semibold mt-1">Travesaños horizontales</div>
                                {horizontalCrossbars.map((component) => <WindowComponent key={component.id} component={component} />)}
                            </div>
                        }

                        {
                            glasses && glasses.length > 0 &&
                            <div>
                                <div className="font-semibold mt-1">Vidrios</div>
                                {glasses.map((component) => <WindowComponent key={component.id} component={component} />)}
                            </div>
                        }


                    </div>
                </div>
            }
        </div>
    );
}

export default Tools;


const WindowComponent = ({ component }: { component: IWindowComponent }) => {
    const selectedComponentId = useAppStore(state => state.selectedComponentId);
    const setSelectedComponentId = useAppStore(state => state.setSelectedComponentId);

    let baseClass = 'p-1 rounded cursor-pointer  ';
    baseClass += selectedComponentId === component.id ? 'bg-blue-500 text-black' : 'text-gray-500 hover:bg-gray-200';

    return (
        <div className={baseClass} onClick={() => setSelectedComponentId(component.id)}>
            {component.name}
        </div>
    );
}