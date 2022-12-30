import { calculateArea, findAngle, randomId } from "../helpers";
import { IPoint } from "../interfaces";
import * as math from 'mathjs'
import { Frame } from "../shapes/Frame";

export class FrameModel {
  readonly id: string;
  private _points: IPoint[];
  private _internalPoints: IPoint[] = [];
  private _height: number = 20;
  public closed: boolean;
  public editingPointIndex: number | null = null;

  constructor(id?: string, points?: IPoint[], height?: number, closed?: boolean, editingPointIndex?: number | null) {
    this.id = id ?? randomId();
    this._points = points ?? [];
    this._height = height ?? 20;
    this.closed = closed ?? false;
    this.editingPointIndex = editingPointIndex ?? null;
    this.calculateInternalPoints();
  }

  get points() {
    return this._points;
  }

  get internalPoints() {
    return this._internalPoints;
  }

  get height() {
    return this._height;
  }

  set points(points: IPoint[]) {
    this._points = points;
    this.calculateInternalPoints();
  }

  set height(height: number) {
    this._height = height;
    this.calculateInternalPoints();
  }

  addPoint(point: IPoint): void {
    this._points.push(point);
    this.calculateInternalPoints();
  }

  removeLastPoint(): void {
    this._points.pop();
    this.calculateInternalPoints();
  }

  replacePoint(index: number, point: IPoint): void {
    this._points[index] = point;
    this.calculateInternalPoints();
  }

  toComponent(): JSX.Element {
    return <Frame key={this.id} frame={this} />;
  }

  clone(): FrameModel {
    return new FrameModel(this.id, this.points, this.height, this.closed, this.editingPointIndex);
  }

  private calculateInternalPoints(): void {
    this._internalPoints = [];

    /// Si tengo mas de dos puntos puedo calcular el poligono interno que representa el vidrio
    if (this.points.length < 3) {
      return;
    }

    /// Sentido de los puntos del poligono
    const clockwisePolygon = calculateArea(this.points) > 0;

    for (let i = 0; i < this.points.length; i++) {

      const a = this.points[(i + this.points.length - 1) % this.points.length];
      const b = this.points[i];
      const c = this.points[(i + 1) % this.points.length];

      const alpha = findAngle(a, b, c);

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
      const hipotenus = this.height / Math.sin(beta);
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
      const finalX = dX + this.height / Math.sqrt(Math.pow(finalUVector.x, 2) + Math.pow(finalUVector.y, 2)) * finalUVector.x;
      const finalY = dY + this.height / Math.sqrt(Math.pow(finalUVector.x, 2) + Math.pow(finalUVector.y, 2)) * finalUVector.y;

      if (!isNaN(finalX) && !isNaN(finalY) && isFinite(finalX) && isFinite(finalY)) {

        this.internalPoints.push({ x: finalX, y: finalY });
      }

    }

  }


}