import { IPoint } from "../interfaces";

export class GlassModel {
  id: string;
  points: IPoint[];
  name: string;

  constructor(id: string, points: IPoint[], name: string) {
    this.id = id;
    this.points = points;
    this.name = name;
  }

  clone(): GlassModel {
    return new GlassModel(this.id, this.points, this.name);
  }
}