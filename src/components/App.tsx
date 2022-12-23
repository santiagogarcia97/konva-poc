import { KonvaEventObject } from 'konva/lib/Node';
import React, { ReactElement, useEffect, useRef } from 'react';
import { Layer, Line, Stage } from 'react-konva';
import { IPoint } from '../interfaces';
import useAppStore from '../store';
import Grid from './Grid';
import Tools from './Tools';

/// para generar las keys de los componentes
const randomId = () => {
  return Math.random().toString(36);
};



const App = () => {
  const canvaHeight = window.innerHeight;
  const canvaWidth = window.innerWidth;

  const state = useAppStore();


  const createLine = (start: IPoint, end: IPoint): ReactElement => {
    return (<Line
      key={randomId()}
      points={[start.x, start.y, end.x, end.y]}
      stroke='rgba(0, 0, 0, 1)'
      strokeWidth={state.strokeWidth}
    />);
  };

  const onClick = (e: KonvaEventObject<MouseEvent>) => {
    /// si no hay punto de inicio, se crea uno
    if (!state.startPoint) {
      state.setStartPoint(
        { x: e.evt.x, y: e.evt.y, }
      );
      return;
    }

    /// si hay punto de inicio, se crea una linea y se agregan a las lineas dibujadas
    state.addDrawing(
      createLine(state.startPoint, { x: e.evt.x, y: e.evt.y, })
    );

    state.setStartPoint(null);
    state.setCurrentDrawing(null);

  };


  /// para previsualizar la linea que se esta dibujando
  const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (state.startPoint) {
      state.setCurrentDrawing(
        createLine(state.startPoint, { x: e.evt.x, y: e.evt.y, })
      );
    }
  };



  /// junto las lineas dibujadas con la linea que se esta dibujando
  const drawings = [...state.drawings];
  if (state.currentDrawing) drawings.push(state.currentDrawing);

  return (
    <div className='relative'>
      <Stage width={canvaWidth} height={canvaHeight} onClick={onClick} onMouseMove={onMouseMove}>
        <Layer>{drawings}</Layer>

        <Grid width={canvaWidth} height={canvaHeight}></Grid>

      </Stage>

      
      <Tools/>

    </div>
  );

};

export default App;