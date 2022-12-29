import { KonvaEventObject } from 'konva/lib/Node';
import React, { MouseEventHandler, ReactElement, useEffect, useRef } from 'react';
import { Layer, Line, Stage } from 'react-konva';
import { IPoint } from '../interfaces';
import WindowFrame from '../shapes/WindowFrame';
import useAppStore from '../store';
import Grid from './Grid';
import Tools from './Tools';
import shallow from 'zustand/shallow'
import Test from '../shapes/Test';
import { randomId } from '../helpers';

const isInsideRadius = (p1: IPoint, p2: IPoint, radius: number) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < radius;
};


const App = () => {
    const canvaHeight = window.innerHeight;
    const canvaWidth = window.innerWidth;

    const [points, setPoints] = React.useState<IPoint[] | null>(null);

    const [setMousePosition, addDrawing, currentDrawing, drawings, setCurrentDrawing, setStartPoint, startPoint, strokeWidth,] = useAppStore(
        (state) => [state.setMousePosition, state.addDrawing, state.currentDrawing, state.drawings, state.setCurrentDrawing, state.setStartPoint, state.startPoint, state.strokeWidth,],
        shallow
    )

    const createLine = (start: IPoint, end: IPoint): ReactElement => {
        /*
        return (<WindowFrame
            key={randomId()}
            start={start}

            end={end}

        />);
        */
        return (<Line
            key={randomId()}
            points={[start.x, start.y, end.x, end.y]}
            stroke='rgba(0, 0, 0, 1)'
            strokeWidth={strokeWidth}
        />);
    };

    const onClick = (e: KonvaEventObject<MouseEvent>) => {

        /// Si no hay puntos, se crea el primero
        if (!points) {
            setPoints([{ x: e.evt.x, y: e.evt.y, }]);
            return;
        }

        /// Si hay puntos y se hace click derecho, se elimina el ultimo punto
        if (e.evt.button === 2) {
            points.pop();
            setPoints(points?.length ? [...points] : null);

            /// Si quedan puntos en el array actualizo el dibujo actual llamando a onMouseMove
            /// si no hay puntos, se elimina el dibujo actual
            if (points?.length) onMouseMove(e); else setCurrentDrawing(null);

            return;
        }


        /// Si hay puntos y se hace click izquierdo, se crea un nuevo punto
        const mousePosition = { x: e.evt.x, y: e.evt.y, };
        if (isInsideRadius(points![0], mousePosition, 50)) {
            addDrawing(<Test key={randomId()} points={points} closed />);
            setPoints(null);
            setCurrentDrawing(null);
            return;
        }


        /// Si hay puntos y se hace click izquierdo, se crea un nuevo punto
        setPoints([...points, getEndingPoint(mousePosition)]);


    };

    const getEndingPoint = (point: IPoint): IPoint => {

        const absXDiff = Math.abs(point.x - points![points!.length - 1].x);
        const absYDiff = Math.abs(point.y - points![points!.length - 1]!.y);

        if (absXDiff > absYDiff) {
            return { x: point.x, y: points![points!.length - 1]!.y, };
        } else {
            return { x: points![points!.length - 1]!.x, y: point.y, };
        }
    };

    /// para previsualizar la linea que se esta dibujando
    const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        const mousePos: IPoint = { x: e.evt.x, y: e.evt.y, };
        setMousePosition(mousePos);

        if (!points) return;

        if (isInsideRadius(points[0], mousePos, 50)) {
            setCurrentDrawing(
                <Test key={randomId()} points={points} closed />
            );
        } else {
            setCurrentDrawing(
                <Test key={randomId()} points={[...points, getEndingPoint(mousePos)]} closed={false} />
            );
        }
        /*
        if (startPoint) {
            setCurrentDrawing(
                createLine(startPoint, getEndingPoint(mousePos))
            );
        }
        */
    };



    /// junto las lineas dibujadas con la linea que se esta dibujando
    const drawingsList = [...drawings];
    if (currentDrawing) drawingsList.push(currentDrawing);

    //drawingsList.push(<WindowFrame key={randomId()} points={[{ x: 300, y: 300 }, { x: 300, y: 500 }, { x: 500, y: 500 }]} />);

    //drawingsList.push(<WindowFrame key={randomId()} points={[{ x: 300, y: 300 }, { x: 600, y: 100 }, { x: 500, y: 500 }]} />);

    const onContextMenu = (e: KonvaEventObject<PointerEvent>) => {
        e.evt.preventDefault();
        e.evt.stopImmediatePropagation();
        return false;
    };

    return (
        <div className='relative' >
            <Stage width={canvaWidth} height={canvaHeight} onClick={onClick} onMouseMove={onMouseMove} onContextMenu={onContextMenu}>
                <Grid width={canvaWidth} height={canvaHeight}></Grid>

                <Layer>{drawingsList}</Layer>
            </Stage>


            <Tools />

        </div>
    );

};

export default App;