import { IRectangle } from "../interfaces";

export class CrossbarModel {
  id: string;
  corners: IRectangle;

  constructor(id: string, corners: IRectangle) {
    this.id = id;
    this.corners = corners;
  }

  clone(): CrossbarModel {
    return new CrossbarModel(this.id, this.corners);
  }
}