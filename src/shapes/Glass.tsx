import { Group, Shape, Text } from "react-konva";
import { calculateCentroid } from "../helpers";
import { IPoint } from "../interfaces";

export const Glass = ({ points, text }: { points: IPoint[], text: string }) => {

    const centroid = calculateCentroid(points);

    return (
        <Group>
            <Shape
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
                fill="#00D2FF"
                stroke="black"
                strokeWidth={1}
            />
            <Text text={text} x={centroid.x} y={centroid.y} />
        </Group>
    );
}; 