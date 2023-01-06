import { calculateInternalPoints, incrementString, isRectangle, randomId } from "../helpers";
import { IPoint, IRectangle } from "../interfaces";
import { CrossbarModel } from "./CrossbarModel";
import { GlassModel } from "./GlassModel";
import { SideModel } from "./SideModel";

export class WindowModel {
  readonly id: string;
  height: number;
  width: number;
  frameHeight: number;
  internalFrameHeight: number;

  horizontalDivisions: number;
  verticalDivisions: number;

  points: IPoint[];
  internalPoints: IPoint[];

  glasses: GlassModel[];
  verticalCrossbars: CrossbarModel[];
  horizontalCrossbars: CrossbarModel[];
  sides: SideModel[];
  internalSides: SideModel[];

  private _rectangle: IRectangle | null = null;

  editing: boolean;

  constructor(
    id: string | null,
    height: number,
    width: number,
    frameHeight: number,
    internalFrameHeight: number,
    horizontalDivisions: number,
    verticalDivisions: number,
    points?: IPoint[],
    internalPoints?: IPoint[],
    glasses?: GlassModel[],
    verticalCrossbars?: CrossbarModel[],
    horizontalCrossbars?: CrossbarModel[],
    sides?: SideModel[],
    internalSides?: SideModel[],
    rectangle: IRectangle | null = null,
    editing: boolean = false,
  ) {
    this.id = id ?? randomId();
    this.height = height;
    this.width = width;
    this.frameHeight = frameHeight;
    this.internalFrameHeight = internalFrameHeight;

    this.horizontalDivisions = horizontalDivisions;
    this.verticalDivisions = verticalDivisions;

    this.points = points ?? [];
    this.internalPoints = internalPoints ?? [];

    this.glasses = glasses ?? [];
    this.verticalCrossbars = verticalCrossbars ?? [];
    this.horizontalCrossbars = horizontalCrossbars ?? [];
    this.sides = sides ?? [];
    this.internalSides = internalSides ?? [];

    this._rectangle = rectangle;

    this.editing = editing;

    this.calcuateWindow();
  }

  clone(): WindowModel {
    return new WindowModel(
      this.id,
      this.height,
      this.width,
      this.frameHeight,
      this.internalFrameHeight,
      this.horizontalDivisions,
      this.verticalDivisions,
      this.points,
      this.internalPoints,
      this.glasses,
      this.verticalCrossbars,
      this.horizontalCrossbars,
      this.sides,
      this.internalSides,
      this._rectangle,
      this.editing,
    );
  }


  calcuateWindow(): void {
    this.internalPoints = calculateInternalPoints(this.points, this.frameHeight)

    /// Si tengo dos puntos solamente dibujo una seccion
    if (this.points.length === 2) {
      this.internalPoints = [];

      const uVectorX = (this.points[1].x - this.points[0].x) / Math.sqrt(Math.pow(this.points[1].x - this.points[0].x, 2) + Math.pow(this.points[1].y - this.points[0].y, 2));
      const uVectorY = (this.points[1].y - this.points[0].y) / Math.sqrt(Math.pow(this.points[1].x - this.points[0].x, 2) + Math.pow(this.points[1].y - this.points[0].y, 2));
      const uVector = { x: uVectorX, y: uVectorY };

      const uVectorNormal = { x: uVector.y, y: uVector.x * -1 };

      for (let i = 0; i < this.points.length; i++) {
        const vector1 = i % 2 === 0 ? uVector : { x: uVector.x * -1, y: uVector.y * -1 };


        const dX = this.points[i].x + this.frameHeight / Math.sqrt(Math.pow(vector1.x, 2) + Math.pow(vector1.y, 2)) * vector1.x;
        const dY = this.points[i].y + this.frameHeight / Math.sqrt(Math.pow(vector1.x, 2) + Math.pow(vector1.y, 2)) * vector1.y;

        /// El punto d se traslada en la direccion del vector unitario B->C la distancia del cateto opuesto (altura del marco)
        const finalX = dX + this.frameHeight / Math.sqrt(Math.pow(uVectorNormal.x, 2) + Math.pow(uVectorNormal.y, 2)) * uVectorNormal.x;
        const finalY = dY + this.frameHeight / Math.sqrt(Math.pow(uVectorNormal.x, 2) + Math.pow(uVectorNormal.y, 2)) * uVectorNormal.y;

        this.internalPoints.push({ x: finalX, y: finalY });
      }
    }

    this.createSides();
    this.createCrossbars();
    this.createGlasses();

  }

  createSides(): void {
    this.sides = [];
    if (this.internalPoints.length < 2) console.log('Not enough points to draw sides');

    for (let i = 0; i < this.points.length; i++) {
      const a = this.points[i];
      const b = this.points[(i + 1) % this.points.length];

      const c = this.internalPoints[(i + 1) % this.internalPoints.length];
      const d = this.internalPoints[i];

      if (a && b && c && d) this.sides.push(new SideModel(randomId(), [a, b, c, d]));
    }
  }


  createCrossbars(): void {
    this.verticalCrossbars = [];
    this.horizontalCrossbars = [];

    this._rectangle = isRectangle(this.internalPoints);
    if (!this._rectangle) return;


    /// Creo los crossbars verticales
    const rectangleWidth = this._rectangle.topRight.x - this._rectangle.topLeft.x;
    const sectionWidth = rectangleWidth / this.horizontalDivisions;

    for (let i = 1; i < this.horizontalDivisions; i++) {
      const topLeft = { x: this._rectangle.topLeft.x + i * sectionWidth - this.frameHeight / 2, y: this._rectangle.topLeft.y };
      const topRight = { x: this._rectangle.topLeft.x + i * sectionWidth + this.frameHeight / 2, y: this._rectangle.topLeft.y };
      const bottomRight = { x: this._rectangle.topLeft.x + i * sectionWidth + this.frameHeight / 2, y: this._rectangle.bottomLeft.y };
      const bottomLeft = { x: this._rectangle.topLeft.x + i * sectionWidth - this.frameHeight / 2, y: this._rectangle.bottomLeft.y };

      //texts.push(<Text key={ randomId() } x = { topLeft.x } y = { topLeft.y } text = { 'H' + i.toString() } fontSize = { 12} />);
      this.verticalCrossbars.push(new CrossbarModel(randomId(), { topLeft, topRight, bottomRight, bottomLeft }));
    }


    /// Creo los crossbars horizontales
    const rectangleHeight = this._rectangle.bottomLeft.y - this._rectangle.topLeft.y;
    const sectionHeight = rectangleHeight / this.verticalDivisions;

    for (let i = 0; i < (this.verticalDivisions - 1) * this.horizontalDivisions; i++) {

      const leftX = this._rectangle.topLeft.x + (i % this.horizontalDivisions) * sectionWidth + (i % this.horizontalDivisions !== 0 ? this.frameHeight / 2 : 0);
      const topY = this._rectangle.topLeft.y + sectionHeight * Math.ceil((i + 1) / this.horizontalDivisions) - this.frameHeight / 2;
      const bottomY = this._rectangle.topLeft.y + sectionHeight * Math.ceil((i + 1) / this.horizontalDivisions) + this.frameHeight / 2;
      const rightX = this._rectangle.topLeft.x + (i % this.horizontalDivisions) * sectionWidth + sectionWidth - (i % this.horizontalDivisions !== this.horizontalDivisions - 1 ? this.frameHeight / 2 : 0);

      const topLeft = { x: leftX, y: topY };
      const topRight = { x: rightX, y: topY };
      const bottomRight = { x: rightX, y: bottomY };
      const bottomLeft = { x: leftX, y: bottomY };

      //texts.push(<Text key={ randomId() } x = { topLeft.x } y = { topLeft.y } text = { 'V' + i.toString() } fontSize = { 12} />);
      this.horizontalCrossbars.push(new CrossbarModel(randomId(), { topLeft, topRight, bottomRight, bottomLeft }));

    }
  }


  createGlasses(): void {
    this.glasses = [];

    if (!this._rectangle) {
      if (this.internalPoints.length > 2)
        this.glasses.push(new GlassModel(randomId(), this.internalPoints, 'A'));

      return;
    }

    /// Creo los vidrios con sus respectivos sides
    let lastGlassName: string | null = null;

    for (let i = 0; i < this.verticalDivisions; i++) {
      for (let j = 0; j < this.horizontalDivisions; j++) {
        const topLeft = {
          x: j === 0 ? this._rectangle.topLeft.x : this.verticalCrossbars[j - 1].corners.topRight.x,
          y: i === 0 ? this._rectangle.topLeft.y : this.horizontalCrossbars[(i - 1) * this.horizontalDivisions + j].corners.bottomLeft.y
        };
        const topRight = {
          x: j === this.horizontalDivisions - 1 ? this._rectangle.topRight.x : this.verticalCrossbars[j].corners.topLeft.x,
          y: i === 0 ? this._rectangle.topRight.y : this.horizontalCrossbars[(i - 1) * this.horizontalDivisions + j].corners.bottomRight.y
        };
        const bottomRight = {
          x: j === this.horizontalDivisions - 1 ? this._rectangle.bottomRight.x : this.verticalCrossbars[j].corners.bottomLeft.x,
          y: i === this.verticalDivisions - 1 ? this._rectangle.bottomRight.y : this.horizontalCrossbars[i * this.horizontalDivisions + j].corners.topRight.y
        };
        const bottomLeft = {
          x: j === 0 ? this._rectangle.bottomLeft.x : this.verticalCrossbars[j - 1].corners.bottomRight.x,
          y: i === this.verticalDivisions - 1 ? this._rectangle.bottomLeft.y : this.horizontalCrossbars[i * this.horizontalDivisions + j].corners.topLeft.y
        };

        const glassFramePoints = [topLeft, topRight, bottomRight, bottomLeft];
        const glassPoints: IPoint[] = calculateInternalPoints(glassFramePoints, this.internalFrameHeight);

        /// Creo los lados del marco del vidrio
        for (let i = 0; i < glassFramePoints.length; i++) {
          const a = glassFramePoints[i];
          const b = glassFramePoints[(i + 1) % glassFramePoints.length];

          const c = glassPoints[(i + 1) % glassPoints.length];
          const d = glassPoints[i];

          if (a && b && c && d)
            this.sides.push(new SideModel(randomId(), [a, b, c, d]));
        }

        lastGlassName = lastGlassName ? incrementString(lastGlassName) : 'A';
        this.glasses.push(new GlassModel(randomId(), glassPoints, lastGlassName));
      }
    }
  }


}