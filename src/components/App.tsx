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
import { isInsideRadius, randomId } from '../helpers';
import { Frame } from '../shapes/Frame';
import { FrameModel } from '../models/FrameModel';


const App = () => {
    const canvaHeight = window.innerHeight;
    const canvaWidth = window.innerWidth;

    const [setMousePosition, frame, setFrame, mouse] = useAppStore(
        (state) => [state.setMousePosition, state.frame, state.setFrame, state.mousePosition],
        shallow
    )


    const onClick = (e: KonvaEventObject<MouseEvent>) => {
        const mousePosition = { x: e.evt.x, y: e.evt.y, };

        if (!frame) {
            const frame = new FrameModel();
            frame.addPoint(mousePosition);

            setFrame(frame);
            return;
        }


        /// Si hay puntos y se hace click derecho, se elimina el ultimo punto
        if (e.evt.button === 2) {
            const newFrame = frame.clone();
            newFrame.removeLastPoint();
            newFrame.editingPointIndex = null;
            setFrame(newFrame);

            /// Si quedan puntos en el array actualizo el dibujo actual llamando a onMouseMove
            /// si no hay puntos, se elimina el dibujo actual
            if (newFrame.points?.length) onMouseMove(e); else setFrame(null);

            return;
        }


        /// Si hay puntos y se hace click izquierdo, se crea un nuevo punto
        if (isInsideRadius(frame.points[0], mousePosition, 50)) {

            frame.closed = true;
            setFrame(frame.clone());

            return;
        }


        /// Si hay puntos y se hace click izquierdo, se crea un nuevo punto
        const newFrame = frame.clone();
        newFrame.replacePoint(frame.editingPointIndex!,mousePosition);
        newFrame.editingPointIndex = null;
        setFrame(newFrame);
    };

    const getEndingPoint = (point: IPoint): IPoint => {

        const absXDiff = Math.abs(point.x - frame!.points[frame!.points.length - 1].x);
        const absYDiff = Math.abs(point.y - frame!.points[frame!.points.length - 1]!.y);

        if (absXDiff > absYDiff) {
            return { x: point.x, y: frame!.points[frame!.points.length - 1]!.y, };
        } else {
            return { x: frame!.points[frame!.points.length - 1]!.x, y: point.y, };
        }
    };

    /// para previsualizar la linea que se esta dibujando
    const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        const mousePosition: IPoint = { x: e.evt.x, y: e.evt.y, };
        setMousePosition(mousePosition);

        if (!frame?.points.length) return;

        if(frame.closed && frame.editingPointIndex === null) return;

        const newFrame = frame.clone();

        if(frame.editingPointIndex === null) {
            newFrame.editingPointIndex = newFrame.points.length;

        }

        newFrame!.closed = false;
        newFrame!.replacePoint(newFrame.editingPointIndex!, mousePosition);

        if (isInsideRadius(frame!.points[0], mousePosition, 50)) {
            newFrame.removeLastPoint();
            newFrame.editingPointIndex = null;
            newFrame!.closed = true;
            console.log(newFrame);
        }

        console.log(newFrame);

        setFrame(newFrame);
        /*
        if (startPoint) {
            setCurrentDrawing(
                createLine(startPoint, getEndingPoint(mousePos))
            );
        }
        */
    };



    /// junto las lineas dibujadas con la linea que se esta dibujando
    ///const drawingsList = [...drawings];
    ///if (currentDrawing) drawingsList.push(currentDrawing);

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

                <Layer>{frame?.toComponent()}</Layer>
            </Stage>


            <Tools />

        </div>
    );

};

export default App;