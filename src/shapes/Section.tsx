import { Shape } from "react-konva";
import { calculateArea, findAngle } from "../helpers";
import { IPoint } from "../interfaces";

export const Section = ({ points }: { points: IPoint[]}) => {

    return (<Shape
        sceneFunc={(context, shape) => {

            context.beginPath();

            /// Primero dibujo el perimetro del poligono
            context.moveTo(points[0].x, points[0].y);
            for (const p of points) {
                context.lineTo(p.x, p.y);
            }
            context.lineTo(points[0].x, points[0].y);

            context.closePath();
            context.fillStrokeShape(shape);

        }}
        fill="#A57548"
        stroke="black"
        strokeWidth={1}
    />);
}