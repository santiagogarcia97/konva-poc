import { KonvaEventObject } from 'konva/lib/Node';
import {  Layer,  Stage } from 'react-konva';
import { IPoint } from '../interfaces';
import useAppStore from '../store';
import Grid from './Grid';
import Tools from './Tools';
import shallow from 'zustand/shallow'
import { randomId } from '../helpers';
import Window from '../shapes/Window';
import { MousePosition } from './MousePosition';

// const isInsideRadius = (p1: IPoint, p2: IPoint, radius: number) => {
//     const dx = p1.x - p2.x;
//     const dy = p1.y - p2.y;
//     const distance = Math.sqrt(dx * dx + dy * dy);
//     return distance < radius;
// };


const App = () => {
    const canvaHeight = window.innerHeight;
    const canvaWidth = window.innerWidth;

    const [
        setMousePosition,
        windowModel,
        setWindowModel,
    ] = useAppStore(
        (state) => [
            state.setMousePosition,
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

        /// Si la ventana no esta en modo edicion no le permito hacer nada
        // if (!windowModel?.editing) return;

        // if (!windowModel.points.length) {
        //     const points = [mousePosition];
        //     windowModel.points = points;
        //     windowModel.calcuateWindow();
        //     setWindowModel(windowModel.clone());
        //     return;
        // }

        // if (e.evt.button === 2) {
        //     windowModel.points.pop();
        //     windowModel.calcuateWindow();
        //     setWindowModel(windowModel.clone());
        //     return;
        // }

        // if (isInsideRadius(windowModel.points[0], mousePosition, 50)) {
        //     windowModel.editing = false;
        //     windowModel.points.pop();
        //     setWindowModel(windowModel.clone());
        //     return;
        // }

        // windowModel.points.push(mousePosition);
        // windowModel.calcuateWindow();
        // setWindowModel(windowModel.clone());

    };


    /// para previsualizar la linea que se esta dibujando
    const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        const mousePosition = getMousePosition(e);

        // if (!windowModel?.editing) return;

        // if (windowModel.points.length) {
        //     if (windowModel.points.length > 1) {
        //         windowModel.points.pop();
        //     }

        //     windowModel.points.push(mousePosition);
        //     windowModel.calcuateWindow();
        //     setWindowModel(windowModel.clone());

        // }

    };


    const drawingsList = [];
    if (windowModel) drawingsList.push(<Window key={randomId()} window={windowModel} />);


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
                offsetX={Math.floor(-window.innerWidth / 2) - 288 / 2}
                offsetY={Math.floor(-window.innerHeight / 2)}
            >
                <Grid width={canvaWidth} height={canvaHeight}></Grid>

                <Layer>{drawingsList}</Layer>
            </Stage>


            <Tools />

            <MousePosition/>

        </div>
    );

};

export default App;