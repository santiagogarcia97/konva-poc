export interface IPoint {
  x: number;
  y: number;
}

export interface IRectangle { 
  topLeft: IPoint;
  topRight: IPoint;
  bottomLeft: IPoint;
  bottomRight: IPoint;
}

export interface IWindowComponent {
  id: string;
  name: string;
  type: WindowComponentType;
}

export enum WindowComponentType {
  EXTERNAL_SIDE,
  INTERNAL_SIDE,
  HORIZONTAL_CROSSBAR,
  VERTICAL_CROSSBAR,
  GLASS,
}