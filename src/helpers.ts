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