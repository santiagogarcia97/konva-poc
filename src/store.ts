import { ReactElement } from 'react';
import create from 'zustand'
import { IPoint } from './interfaces';

interface IAppStore {
  mousePosition: IPoint | null; /// posición del mouse
  setMousePosition: (point: IPoint | null) => void;
  drawings: ReactElement[]; /// listado de elementos dibujados
  addDrawing: (drawing: ReactElement) => void;
  clearDrawings: () => void;
  startPoint: IPoint | null; /// punto inicial del dibujo actual
  setStartPoint: (point: IPoint | null) => void;
  currentDrawing: ReactElement | null; /// dibujo actual
  setCurrentDrawing: (drawing: ReactElement | null) => void;
  strokeWidth: number; 
  setStrokeWidth: (width: number) => void;
  horizontalSections: number; 
  setHorizontalSections: (sections: number) => void;
  verticalSections: number;
  setVerticalSections: (sections: number) => void;
  frameHeight: number; 
  setFrameHeight: (height: number) => void;
  windowsHeight: number;
  setWindowsHeight: (height: number) => void;
  windowsWidth: number;
  setWindowsWidth: (width: number) => void;
};

const useAppStore = create<IAppStore>((set) => ({
  mousePosition: null,
  setMousePosition: (point: IPoint | null) => set(() => ({ mousePosition: point })),
  drawings: [],
  addDrawing: (drawing: ReactElement) => set((state) => ({ drawings: [...state.drawings, drawing] })),
  clearDrawings: () => set(() => ({ drawings: [] })),
  startPoint: null,
  setStartPoint: (point: IPoint | null) => set(() => ({ startPoint: point })),
  currentDrawing: null,
  setCurrentDrawing: (drawing: ReactElement | null) => set(() => ({ currentDrawing: drawing })),
  strokeWidth: 5,
  setStrokeWidth: (width: number) => set(() => ({ strokeWidth: width })),
  horizontalSections: 3,
  setHorizontalSections: (sections: number) => set(() => ({ horizontalSections: sections })),
  verticalSections: 1,
  setVerticalSections: (sections: number) => set(() => ({ verticalSections: sections })),
  frameHeight: 15,
  setFrameHeight: (height: number) => set(() => ({ frameHeight: height })),
  windowsHeight: 500,
  setWindowsHeight: (height: number) => set(() => ({ windowsHeight: height })),
  windowsWidth: 400,
  setWindowsWidth: (width: number) => set(() => ({ windowsWidth: width })),
}))

export default useAppStore;