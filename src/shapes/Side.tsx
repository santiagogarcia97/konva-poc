import { Shape } from "react-konva";
import { SideModel } from "../models/SideModel";

export const Side = ({ side }: { side: SideModel }) => {
    return (<Shape
        sceneFunc={(context, shape) => {

            context.beginPath();

            /// Primero dibujo el perimetro del poligono
            context.moveTo(side.points[0].x, side.points[0].y);
            for (const p of side.points) {
                context.lineTo(p.x, p.y);
            }
            context.lineTo(side.points[0].x, side.points[0].y);

            context.closePath();
            context.fillStrokeShape(shape);

        }}
        fill="#A57548"
        stroke="black"
        strokeWidth={1}
    />);
}