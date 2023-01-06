import { IPoint, IRectangle } from "./interfaces";
import * as math from 'mathjs'

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

export const distanceBetweenPoints = (p1: IPoint, p2: IPoint) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}


export const calculateInternalPoints = (coords: IPoint[], height: number): IPoint[] => {
  if (coords.length < 3) return [];

  const clockwisePolygon = calculateArea(coords) > 0;

  const points: IPoint[] = [];

  for (let i = 0; i < coords.length; i++) {

    const a = coords[(i + coords.length - 1) % coords.length];
    const b = coords[i];
    const c = coords[(i + 1) % coords.length];

    const alpha = findAngle(a, b, c);

    //console.log(i, alpha * 180 / Math.PI, beta * 180 / Math.PI);

    /// Si los puntos a, b y c estan conectados en sentido antihorario el determinante de la siguiente matriz es NEGATIVO
    /// en caso contrario es POSITIVO
    /// En caso de ser positivo, cambia la formula de beta
    const matrix = [
      [a.x, a.y, 1],
      [b.x, b.y, 1],
      [c.x, c.y, 1],
    ];

    const clockwise = math.det(matrix) > 0;

    ///console.log(i, a, b, c, clockwise)

    const beta = clockwise ? (2 * Math.PI - alpha) / 2 : alpha / 2;

    /// La mitad del angulo que forman los 3 puntos es el angulo beta con cateto opuesto igual a la altura del marco
    const hipotenus = height / Math.sin(beta);
    const adjacent = hipotenus * Math.cos(beta);

    /// Vector unitario B->C
    const uVectorX = (c.x - b.x) / Math.sqrt(Math.pow(c.x - b.x, 2) + Math.pow(c.y - b.y, 2));
    const uVectorY = (c.y - b.y) / Math.sqrt(Math.pow(c.x - b.x, 2) + Math.pow(c.y - b.y, 2));

    const uVector = clockwisePolygon ? { x: uVectorX * -1, y: uVectorY * -1 } : { x: uVectorX, y: uVectorY };

    /// El punto b se traslada en la direccion del vector unitario B->C la distancia del cateto adyacente
    const dX = b.x + adjacent / Math.sqrt(Math.pow(uVector.x, 2) + Math.pow(uVector.y, 2)) * uVector.x;
    const dY = b.y + adjacent / Math.sqrt(Math.pow(uVector.x, 2) + Math.pow(uVector.y, 2)) * uVector.y;

    /// El vector unitario B->C se rota 90 grados en sentido antihorario (TODO corregir el sentido)
    const finalUVector = { x: uVector.y, y: -uVector.x };

    /// El punto d se traslada en la direccion del vector unitario B->C la distancia del cateto opuesto (altura del marco)
    const finalX = dX + height / Math.sqrt(Math.pow(finalUVector.x, 2) + Math.pow(finalUVector.y, 2)) * finalUVector.x;
    const finalY = dY + height / Math.sqrt(Math.pow(finalUVector.x, 2) + Math.pow(finalUVector.y, 2)) * finalUVector.y;


    //lines.push(<Line key={ randomId() } points = { [a.x, a.y, b.x, b.y]} stroke = "red" strokeWidth = { 3} />);
    //circles.push(<Circle key={ randomId() } x = { b.x } y = { b.y } radius = {(i + 1) * 2} fill = "blue" />);

    if (!isNaN(finalX) && !isNaN(finalY) && isFinite(finalX) && isFinite(finalY)) {
      //circles.push(<Circle key={ randomId() } x = { dX } y = { dY } radius = { 3} fill = "green" />);
      //circles.push(<Circle key={ randomId() } x = { finalX } y = { finalY } radius = { 3} fill = "green" />);

      points.push({ x: finalX, y: finalY });
    }

  }


  return points;

}


export const calculateCentroid = (coords: IPoint[]): IPoint => {
  let x = 0;
  let y = 0;

  for (let i = 0; i < coords.length; i++) {
    x += coords[i].x;
    y += coords[i].y;
  }

  return { x: x / coords.length, y: y / coords.length };
}

export const isRectangle = (coords: IPoint[]): IRectangle | null => {
  if (coords.length !== 4) return null;

  const minX = Math.min(...coords.map(c => c.x));
  const maxX = Math.max(...coords.map(c => c.x));
  const minY = Math.min(...coords.map(c => c.y));
  const maxY = Math.max(...coords.map(c => c.y));

  const topLeft = coords.find(c => c.x === minX && c.y === minY);
  const topRight = coords.find(c => c.x === maxX && c.y === minY);
  const bottomLeft = coords.find(c => c.x === minX && c.y === maxY);
  const bottomRight = coords.find(c => c.x === maxX && c.y === maxY);

  return !!topLeft && !!topRight && !!bottomLeft && !!bottomRight ? { topLeft, topRight, bottomLeft, bottomRight } : null;

}


export const incrementString = (value: string): string => {
  let carry = 1;
  let res = '';

  for (let i = value.length - 1; i >= 0; i--) {
    let char = value.toUpperCase().charCodeAt(i);

    char += carry;

    if (char > 90) {
      char = 65;
      carry = 1;
    } else {
      carry = 0;
    }

    res = String.fromCharCode(char) + res;

    if (!carry) {
      res = value.substring(0, i) + res;
      break;
    }
  }

  if (carry) {
    res = 'A' + res;
  }

  return res;
}