import { IRectangle } from "../interfaces";

export class CrossbarModel {
  id: string;
  corners: IRectangle;
  name: string;

  constructor(id: string, corners: IRectangle, name: string) {
    this.id = id;
    this.corners = corners;
    this.name = name;
  }

  clone(): CrossbarModel {
    return new CrossbarModel(this.id, this.corners, this.name);
  }
}