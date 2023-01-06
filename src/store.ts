import create from 'zustand'
import { IPoint } from './interfaces';
import { WindowModel } from './models/WindowModel';

interface IAppStore {
  /// Posición del mouse
  mousePosition: IPoint | null;
  setMousePosition: (point: IPoint | null) => void;

  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;

  windowModel: WindowModel | null;
  setWindowModel: (windowModel: WindowModel | null) => void;


  /// Propiedades de la ventana
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
  internalFrameHeight: number;
  setInternalFrameHeight: (height: number) => void;
};

const useAppStore = create<IAppStore>((set) => ({
  /// Posición del mouse
  mousePosition: null,
  setMousePosition: (point: IPoint | null) => set(() => ({ mousePosition: point })),

  selectedComponentId: null,
  setSelectedComponentId: (id: string | null) => set(() => ({ selectedComponentId: id })),
  
  windowModel: null,
  setWindowModel: (windowModel: WindowModel | null) => set(() => ({ windowModel: windowModel })),

  /// Propiedades de la ventana
  horizontalSections: 3,
  setHorizontalSections: (sections: number) => set(() => ({ horizontalSections: sections })),
  verticalSections: 2,
  setVerticalSections: (sections: number) => set(() => ({ verticalSections: sections })),
  frameHeight: 20,
  setFrameHeight: (height: number) => set(() => ({ frameHeight: height })),
  windowsHeight: 500,
  setWindowsHeight: (height: number) => set(() => ({ windowsHeight: height })),
  windowsWidth: 400,
  setWindowsWidth: (width: number) => set(() => ({ windowsWidth: width })),
  internalFrameHeight: 10,
  setInternalFrameHeight: (height: number) => set(() => ({ internalFrameHeight: height })),
}))

export default useAppStore;