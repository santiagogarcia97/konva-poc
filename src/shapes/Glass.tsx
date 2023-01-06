import { Group, Shape, Text } from "react-konva";
import { calculateCentroid } from "../helpers";
import { GlassModel } from "../models/GlassModel";
import useAppStore from "../store";

export const Glass = ({glass}: {glass: GlassModel}) => {

    const selectedComponentId = useAppStore(state => state.selectedComponentId);
    const setSelectedComponentId = useAppStore(state => state.setSelectedComponentId);

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
                fill={selectedComponentId === glass.id ? "#96031A": "#00D2FF"}
                stroke="black"
                strokeWidth={1}
                opacity={0.6}
                onClick={() => setSelectedComponentId(glass.id)}
            />
            <Text text={glass.name} x={centroid.x} y={centroid.y} />
        </Group>
    );
}