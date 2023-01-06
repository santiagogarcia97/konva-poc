import { KonvaEventObject } from 'konva/lib/Node';
import React, { MouseEventHandler, ReactElement, useEffect, useRef } from 'react';
import { Circle, Layer, Line, Stage } from 'react-konva';
import { IPoint } from '../interfaces';
import useAppStore from '../store';
import Grid from './Grid';
import Tools from './Tools';
import shallow from 'zustand/shallow'
import Test from '../shapes/Test';
import { randomId } from '../helpers';
import Window from '../shapes/Window';

const isInsideRadius = (p1: IPoint, p2: IPoint, radius: number) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < radius;
};


const App = () => {
    const canvaHeight = window.innerHeight;
    const canvaWidth = window.innerWidth;

    const [
        setMousePosition,
        addDrawing,
        currentDrawing,
        drawings,
        setCurrentDrawing,
        clearDrawings,
        currentPoints,
        setCurrentPoints,
        windowModel,
        setWindowModel,
    ] = useAppStore(
        (state) => [
            state.setMousePosition,
            state.addDrawing,
            state.currentDrawing,
            state.drawings,
            state.setCurrentDrawing,
            state.clearDrawings,
            state.currentPoints,
            state.setCurrentPoints,
            state.windowModel,
            state.setWindowModel,
        ],
        shallow
    )

    const getMousePosition = (e: KonvaEventObject<MouseEvent>): IPoint => {
        const mouseStagePosition = e.target.getStage()?.getRelativePointerPosition();
        const mousePosition: IPoint = mouseStagePosition ? { x: mouseStagePosition.x, y: mouseStagePosition.y, } : { x: e.evt.x, y: e.evt.y, };
        setMousePosition(mousePosition);
        return mousePosition;
    }

    const onClick = (e: KonvaEventObject<MouseEvent>) => {
        const mousePosition = getMousePosition(e);
        
        /// Si ya tengo un dibujo hecho no le permito agregar otro
        if (drawings.length && !currentPoints) return;

        /// Si no hay puntos, se crea el primer punto
        if (!currentPoints) {
            setCurrentPoints([mousePosition]);
            return;
        }

        /// Si hay puntos y se hace click derecho, se elimina el ultimo punto
        if (e.evt.button === 2) {
            currentPoints.pop();
            setCurrentPoints(currentPoints?.length ? [...currentPoints] : null);

            /// Si quedan puntos en el array actualizo el dibujo actual llamando a onMouseMove
            /// si no hay puntos, se elimina el dibujo actual
            if (currentPoints?.length) onMouseMove(e); else setCurrentDrawing(null);
            return;
        }


        /// Si hay puntos y se hace click izquierdo dentro de un radio del punto inicial, se cierra y se crea el dibujo
        if (isInsideRadius(currentPoints![0], mousePosition, 50)) {
            addDrawing(<Test key={randomId()} points={currentPoints} closed />);
            setCurrentPoints(null);
            setCurrentDrawing(null);
            return;
        }


        /// Si hay puntos y se hace click izquierdo, se crea un nuevo punto
        setCurrentPoints([...currentPoints, getEndingPoint(mousePosition)]);
    };

    /// Funcion para proyectar el punto paralelo al eje X o Y dependiendo de cual sea mas cercano
    const getEndingPoint = (point: IPoint): IPoint => {

        const absXDiff = Math.abs(point.x - currentPoints![currentPoints!.length - 1].x);
        const absYDiff = Math.abs(point.y - currentPoints![currentPoints!.length - 1]!.y);

        if (absXDiff > absYDiff) {
            return { x: point.x, y: currentPoints![currentPoints!.length - 1]!.y, };
        } else {
            return { x: currentPoints![currentPoints!.length - 1]!.x, y: point.y, };
        }
    };

    /// para previsualizar la linea que se esta dibujando
    const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        const mousePosition = getMousePosition(e);

        /// Si no hay puntos, no hago nada
        if (!currentPoints) return;

        /// Si hay puntos, previsualizo la linea que se esta dibujando
        clearDrawings();
        if (isInsideRadius(currentPoints[0], mousePosition, 50)) {
            addDrawing(
                <Test key={randomId()} points={currentPoints} closed />
            );
        } else {
            addDrawing(
                <Test key={randomId()} points={[...currentPoints, getEndingPoint(mousePosition)]} closed={false} />
            );
        }
    };



    /// junto las lineas dibujadas con la linea que se esta dibujando
    //const drawingsList = [...drawings];
    //if (currentDrawing) drawingsList.push(currentDrawing);

    const drawingsList = [];
    if(windowModel) drawingsList.push(<Window key={randomId()} window={windowModel} />);


    const onContextMenu = (e: KonvaEventObject<PointerEvent>) => {
        e.evt.preventDefault();
        e.evt.stopImmediatePropagation();
        return false;
    };

    return (
        <div className='relative' >
            <Stage
                width={canvaWidth}
                height={canvaHeight}
                onClick={onClick}
                onMouseMove={onMouseMove}
                onContextMenu={onContextMenu}
                offsetX={Math.floor(-window.innerWidth / 2)}
                offsetY={Math.floor(-window.innerHeight / 2)}
            >
                <Grid width={canvaWidth} height={canvaHeight}></Grid>

                <Layer>{drawingsList}</Layer>
            </Stage>


            <Tools />

        </div>
    );

};

export default App;