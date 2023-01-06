import { IPoint, WindowComponentType } from "../interfaces";

export class SideModel {
  id: string;
  points: IPoint[];
  name: string;
  componentType: WindowComponentType;

  constructor(id: string, points: IPoint[], name: string, componentType: WindowComponentType) {
    this.id = id;
    this.points = points;
    this.name = name;
    this.componentType = componentType;
  }

  clone(): SideModel {
    return new SideModel(this.id, this.points, this.name, this.componentType);
  }

}