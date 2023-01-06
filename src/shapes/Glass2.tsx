import { Group, Shape, Text } from "react-konva";
import { calculateCentroid } from "../helpers";
import { GlassModel } from "../models/GlassModel";

export const Glass2 = ({glass}: {glass: GlassModel}) => {
    const centroid = calculateCentroid(glass.points);

    return (
        <Group>
            <Shape
                sceneFunc={(context, shape) => {

                    context.beginPath();

                    /// Primero dibujo el perimetro del poligono
                    context.moveTo(glass.points[0].x, glass.points[0].y);
                    for (const p of glass.points) {
                        context.lineTo(p.x, p.y);
                    }
                    context.lineTo(glass.points[0].x, glass.points[0].y);

                    context.closePath();
                    context.fillStrokeShape(shape);

                }}
                fill="#00D2FF"
                stroke="black"
                strokeWidth={1}
                opacity={0.6}
            />
            <Text text={glass.id} x={centroid.x} y={centroid.y} />
        </Group>
    );
}