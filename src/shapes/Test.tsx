import { Circle, Group, Line, Shape, Text } from "react-konva";
import { calculateArea, findAngle, randomId } from "../helpers";
import { IPoint } from "../interfaces";
import * as math from 'mathjs'

const Test = ({ points, closed }: { points: IPoint[], closed: boolean }) => {

    const height = 20; /// altura del marco de la ventana
    const lines = [];
    const circles = [];
    const texts = [];

    /// Puntos internos del marco de la ventana
    const internalPoints: IPoint[] = [];


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
    for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        texts.push(createDistanceLabel(a, b));
    }
    if (closed) {
        const a = points[points.length - 1];
        const b = points[0];

        texts.push(createDistanceLabel(a, b));
    }


    /// Si tengo mas de dos puntos puedo calcular el poligono interno que representa el vidrio
    if (points.length > 2) {

        const clockwisePolygon = calculateArea(points) > 0;

        for (let i = 0; i < points.length; i++) {

            const a = points[(i + points.length - 1) % points.length];
            const b = points[i];
            const c = points[(i + 1) % points.length];

            const alpha = findAngle(a, b, c);

            //console.log(i, alpha * 180 / Math.PI, beta * 180 / Math.PI);

            /// Si los puntos a, b y c estan conectados en sentido antihorario el determinante de la siguiente matriz es NEGATIVO
            /// en caso contrario es POSITIVO
            /// En caso de ser positivo, cambia la formula de beta
            const matrix = [
                [a.x, a.y, 1],
                [b.x, b.y, 1],
                [c.x, c.y, 1],
            ];

            const clockwise = math.det(matrix) > 0;

            ///console.log(i, a, b, c, clockwise)

            const beta = clockwise ? (2 * Math.PI - alpha) / 2 : alpha / 2;

            /// La mitad del angulo que forman los 3 puntos es el angulo beta con cateto opuesto igual a la altura del marco
            const hipotenus = height / Math.sin(beta);
            const adjacent = hipotenus * Math.cos(beta);

            /// Vector unitario B->C
            const uVectorX = (c.x - b.x) / Math.sqrt(Math.pow(c.x - b.x, 2) + Math.pow(c.y - b.y, 2));
            const uVectorY = (c.y - b.y) / Math.sqrt(Math.pow(c.x - b.x, 2) + Math.pow(c.y - b.y, 2));

            const uVector = clockwisePolygon ? { x: uVectorX * -1, y: uVectorY * -1 } : { x: uVectorX, y: uVectorY };

            /// El punto b se traslada en la direccion del vector unitario B->C la distancia del cateto adyacente
            const dX = b.x + adjacent / Math.sqrt(Math.pow(uVector.x, 2) + Math.pow(uVector.y, 2)) * uVector.x;
            const dY = b.y + adjacent / Math.sqrt(Math.pow(uVector.x, 2) + Math.pow(uVector.y, 2)) * uVector.y;

            /// El vector unitario B->C se rota 90 grados en sentido antihorario (TODO corregir el sentido)
            const finalUVector = { x: uVector.y, y: -uVector.x };

            /// El punto d se traslada en la direccion del vector unitario B->C la distancia del cateto opuesto (altura del marco)
            const finalX = dX + height / Math.sqrt(Math.pow(finalUVector.x, 2) + Math.pow(finalUVector.y, 2)) * finalUVector.x;
            const finalY = dY + height / Math.sqrt(Math.pow(finalUVector.x, 2) + Math.pow(finalUVector.y, 2)) * finalUVector.y;


            lines.push(<Line key={randomId()} points={[a.x, a.y, b.x, b.y]} stroke="red" strokeWidth={3} />);
            circles.push(<Circle key={randomId()} x={b.x} y={b.y} radius={5} fill="blue" draggable />);

            if (!isNaN(finalX) && !isNaN(finalY) && isFinite(finalX) && isFinite(finalY)) {
                circles.push(<Circle key={randomId()} x={dX} y={dY} radius={3} fill="green" />);
                circles.push(<Circle key={randomId()} x={finalX} y={finalY} radius={3} fill="green" />);

                internalPoints.push({ x: finalX, y: finalY });
            }
        }
    }

    return (
        <Group draggable>
            <Shape
                sceneFunc={(context, shape) => {

                    context.beginPath();

                    /// Primero dibujo el perimetro del poligono
                    for (const p of points) {
                        context.lineTo(p.x, p.y);
                    }
                    context.lineTo(points[0].x, points[0].y);

                    /// Si tengo mas de dos puntos puedo dibujar el poligono interno
                    if (points.length > 2) {
                        context.lineTo(internalPoints[0].x, internalPoints[0].y);
                        for (let i = 1; i < internalPoints.length; i++) {
                            context.lineTo(internalPoints[i].x, internalPoints[i].y);
                            context.lineTo(points[i].x, points[i].y);
                            context.lineTo(internalPoints[i].x, internalPoints[i].y);
                        }

                        context.lineTo(internalPoints[0].x, internalPoints[0].y);
                        context.lineTo(points[0].x, points[0].y);
                    }

                    context.strokeShape(shape);

                    if (closed) {
                        context.closePath();
                        context.fillStrokeShape(shape);
                    }
                }}
                fill="#A57548"
                stroke="black"
                strokeWidth={1}
            />
            {
                internalPoints?.length > 2 &&
                <Shape
                    sceneFunc={(context, shape) => {

                        context.beginPath();

                        context.moveTo(internalPoints[0].x, internalPoints[0].y);
                        /// Primero dibujo el perimetro del poligono
                        for (const p of internalPoints) {
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
            {lines}
            {circles}
            {texts}

        </Group>
    );
};

export default Test;