import { Circle, Group, Line, Shape } from "react-konva";
import { randomId } from "../helpers";
import { IPoint } from "../interfaces";
import * as math from 'mathjs'


const WindowFrame = ({ points }: { points: IPoint[] }) => {
    const height = 20;
    const lines = [];
    const circles = [];

    /// Encuentra el angulo entre tres puntos, siendo B el punto de interseccion
    function find_angle(A: IPoint, B: IPoint, C: IPoint) {
        var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
        var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
        var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));

        // radianes
        return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));

        // grados
        //return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)) * 180 / Math.PI;

    }

    const puntosInternos: IPoint[] = [];

    for (let i = 0; i < points.length; i++) {

        console.log(i);

        const a = points[(i + points.length - 1) % points.length];
        const b = points[i];
        const c = points[(i + 1) % points.length];

        console.log('PUNTOS', a, b, c);

        const alpha = find_angle(a, b, c);
        const beta = alpha / 2;

        console.log('ANGULOS', alpha, beta);
        console.log('ANGULOS GRADOS', alpha * 180 / Math.PI, beta * 180 / Math.PI);

        const hip = height / Math.sin(beta);
        console.log('HIP', hip);

        const ady = hip * Math.cos(beta);
        console.log(ady);

        const x = b.x + height;

        const y = b.y + ady;

        //puntosInternos.push({ x, y });

        console.log('------------------');

        lines.push(<Line key={randomId()} points={[a.x, a.y, b.x, b.y]} stroke="red" strokeWidth={3} />);
        circles.push(<Circle key={randomId()} x={b.x} y={b.y} radius={5} fill="blue" />);


        const uvectorX = (c.x - b.x) / Math.sqrt(Math.pow(c.x - b.x, 2) + Math.pow(c.y - b.y, 2));
        const uvectorY = (c.y - b.y) / Math.sqrt(Math.pow(c.x - b.x, 2) + Math.pow(c.y - b.y, 2));

        const newX = b.x + ady / Math.sqrt(Math.pow(uvectorX, 2) + Math.pow(uvectorY, 2)) * uvectorX;
        const newY = b.y + ady / Math.sqrt(Math.pow(uvectorX, 2) + Math.pow(uvectorY, 2)) * uvectorY;
        circles.push(<Circle key={randomId()} x={newX} y={newY} radius={5} fill="green" />);

        //const finalUVectorX = (a.x - b.x) / Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        //const finalUVectorY = (a.y - b.y) / Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

        const finalUVectorX = -uvectorY;
        const finalUVectorY = uvectorX;

        const finalX = newX + height / Math.sqrt(Math.pow(finalUVectorX, 2) + Math.pow(finalUVectorY, 2)) * finalUVectorX;
        const finalY = newY + height / Math.sqrt(Math.pow(finalUVectorX, 2) + Math.pow(finalUVectorY, 2)) * finalUVectorY;

        circles.push(<Circle key={randomId()} x={finalX} y={finalY} radius={5} fill="green" />);

        puntosInternos.push({ x: finalX, y: finalY });

    }


    return (
        <Group>
            <Shape
                draggable
                key={randomId()}
                sceneFunc={(context, shape) => {

                    context.beginPath();
                    //context.moveTo(points[0].x, points[0].y);

                    for (const p of points) {
                        context.lineTo(p.x, p.y);
                    }
                    context.lineTo(points[0].x, points[0].y);

                    context.lineTo(puntosInternos[0].x, puntosInternos[0].y);
                    for (let i = 1; i < puntosInternos.length; i++) {
                        context.lineTo(puntosInternos[i].x, puntosInternos[i].y);
                        context.lineTo(points[i].x, points[i].y);
                        context.lineTo(puntosInternos[i].x, puntosInternos[i].y);
                    }

                    context.lineTo(puntosInternos[0].x, puntosInternos[0].y);
                    context.lineTo(points[0].x, points[0].y);


                    //context.closePath();
                    // (!) Konva specific method, it is very important
                    context.fillStrokeShape(shape);
                }}
                fill="#00D2FF"
                stroke="black"
                strokeWidth={1}
            />
            {lines}
            {circles}
        </Group>
    );
};

export default WindowFrame;