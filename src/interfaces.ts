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