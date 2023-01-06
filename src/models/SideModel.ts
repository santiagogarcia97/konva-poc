import { IPoint } from "../interfaces";

export class SideModel {
  id: string;
  points: IPoint[];

  constructor(id: string, points: IPoint[]) {
    this.id = id;
    this.points = points;
  }

  clone(): SideModel {
    return new SideModel(this.id, this.points);
  }

}