import { ReactElement } from 'react';
import create from 'zustand'
import { IPoint } from './interfaces';
import { FrameModel } from './models/FrameModel';

interface IAppStore {
  mousePosition: IPoint | null; /// posición del mouse
  setMousePosition: (point: IPoint | null) => void;

  frame: FrameModel | null;
  setFrame: (frame: FrameModel | null) => void;
  //drawings: ReactElement[]; /// listado de elementos dibujados
  //addDrawing: (drawing: ReactElement) => void;
  //clearDrawings: () => void;
  //startPoint: IPoint | null; /// punto inicial del dibujo actual
  //setStartPoint: (point: IPoint | null) => void;
  //currentDrawing: ReactElement | null; /// dibujo actual
  //setCurrentDrawing: (drawing: ReactElement | null) => void;
  //strokeWidth: number; /// grosor del trazo
  //setStrokeWidth: (width: number) => void;
};

const useAppStore = create<IAppStore>((set) => ({
  mousePosition: null,
  setMousePosition: (point: IPoint | null) => set(() => ({ mousePosition: point })),

  frame: null,
  setFrame: (frame: FrameModel | null) => set(() => ({ frame })),
  //drawings: [],
  //addDrawing: (drawing: ReactElement) => set((state) => ({ drawings: [...state.drawings, drawing] })),
  //clearDrawings: () => set(() => ({ drawings: [] })),
  //startPoint: null,
  //setStartPoint: (point: IPoint | null) => set(() => ({ startPoint: point })),
  //currentDrawing: null,
  //setCurrentDrawing: (drawing: ReactElement | null) => set(() => ({ currentDrawing: drawing })),
  //strokeWidth: 5,
  //setStrokeWidth: (width: number) => set(() => ({ strokeWidth: width })),
}))

export default useAppStore;