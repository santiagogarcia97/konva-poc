import { IPoint } from "./interfaces";

/// para generar las keys de los componentes
export const randomId = () => {
  return Math.random().toString(36);
};

/// Encuentra el angulo entre tres puntos, siendo B el punto de interseccion
export const findAngle = (A: IPoint, B: IPoint, C: IPoint) => {
  const AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
  const BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
  const AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));

  // radianes
  return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
}


/// Clockwise ordering gives negative areas
/// Counterclockwise - positive
export const calculateArea = (coords: IPoint[]) => {
  let area = 0;

  for (let i = 0; i < coords.length; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % coords.length];

    area += p1.x * p2.y - p2.x * p1.y
  }

  return area / 2;
}