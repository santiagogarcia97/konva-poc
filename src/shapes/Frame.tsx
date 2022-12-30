import { Group, Shape, Text } from "react-konva";
import { randomId } from "../helpers";
import { IPoint } from "../interfaces";
import { FrameModel } from "../models/FrameModel";

export const Frame = ({ frame }: { frame: FrameModel }) => {

    const texts = [];

    const createDistanceLabel = (a: IPoint, b: IPoint) => {
        const x = (a.x + b.x) / 2;
        const y = (a.y + b.y) / 2;

        return <Text
            key={randomId()}
            x={x}
            y={y}
            offsetX={50}
            offsetY={50}
            fontStyle="bold"
            text={Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)).toFixed(2)}
            height={100}
            width={100}
            verticalAlign="middle"
            align="center"
        />;
    };


    /// crea los labels de distancia entre los puntos
    for (let i = 0; i < frame.points.length - 1; i++) {
        const a = frame.points[i];
        const b = frame.points[i + 1];
        texts.push(createDistanceLabel(a, b));
    }
    if (frame.closed) {
        const a = frame.points[frame.points.length - 1];
        const b = frame.points[0];

        texts.push(createDistanceLabel(a, b));
    }



    return (
        <Group draggable>
            <Shape
                sceneFunc={(context, shape) => {

                    context.beginPath();

                    /// Primero dibujo el perimetro del poligono
                    for (const p of frame.points) {
                        context.lineTo(p.x, p.y);
                    }
                    context.lineTo(frame.points[0].x, frame.points[0].y);

                    /// Si tengo mas de dos puntos puedo dibujar el poligono interno
                    if (frame.points.length > 2) {
                        context.lineTo(frame.internalPoints[0].x, frame.internalPoints[0].y);
                        for (let i = 1; i < frame.internalPoints.length; i++) {
                            context.lineTo(frame.internalPoints[i].x, frame.internalPoints[i].y);
                            context.lineTo(frame.points[i].x, frame.points[i].y);
                            context.lineTo(frame.internalPoints[i].x, frame.internalPoints[i].y);
                        }

                        context.lineTo(frame.internalPoints[0].x, frame.internalPoints[0].y);
                        context.lineTo(frame.points[0].x, frame.points[0].y);
                    }

                    context.strokeShape(shape);

                    if (frame.closed) {
                        context.closePath();
                        context.fillStrokeShape(shape);
                    }
                }}
                fill="#A57548"
                stroke="black"
                strokeWidth={1}
            />
            {
                frame.internalPoints?.length > 2 &&
                <Shape
                    sceneFunc={(context, shape) => {

                        context.beginPath();

                        context.moveTo(frame.internalPoints[0].x, frame.internalPoints[0].y);
                        /// Primero dibujo el perimetro del poligono
                        for (const p of frame.internalPoints) {
                            context.lineTo(p.x, p.y);
                        }
                        context.closePath();
                        context.fillStrokeShape(shape);


                    }}
                    fill="#00D2FF"
                    stroke="black"
                    strokeWidth={1}
                />
            }
            {texts}
        </Group>
    );
}