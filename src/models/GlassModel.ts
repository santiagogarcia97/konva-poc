import { IPoint } from "../interfaces";

export class GlassModel {
  id: string;
  points: IPoint[];

  constructor(id: string, points: IPoint[]) {
    this.id = id;
    this.points = points;
  }

  clone(): GlassModel {
    return new GlassModel(this.id, this.points);
  }
}