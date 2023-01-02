import { Circle, Group, Line, Shape, Text } from "react-konva";
import { calculateArea, calculateCentroid, calculateInternalPoints, distanceBetweenPoints, findAngle, isRectangle, randomId } from "../helpers";
import { IPoint, IRectangle } from "../interfaces";
import * as math from 'mathjs'
import { Section } from "./Section";
import { Glass } from "./Glass";
import useAppStore from "../store";

const Test = ({ points, closed }: { points: IPoint[], closed: boolean }) => {
    // const isRectangle = points.length === 4 && closed
    //     && Math.abs(distanceBetweenPoints(points[0], points[1])) === Math.abs(distanceBetweenPoints(points[2], points[3]))
    //     && Math.abs(distanceBetweenPoints(points[1], points[2])) === Math.abs(distanceBetweenPoints(points[3], points[0]));

    const frameHeight = useAppStore(state => state.frameHeight);
    //const lines = [];
    const circles: JSX.Element[] = [];
    const texts: JSX.Element[] = [];
    const sections: JSX.Element[] = [];
    const glass: JSX.Element[] = [];

    const horizontalSections = useAppStore(state => state.horizontalSections);
    const verticalSections = useAppStore(state => state.verticalSections);

    /// Puntos internos del marco de la ventana
    const internalPoints: IPoint[] = calculateInternalPoints(points, frameHeight);

    ///const internalInternalPoints: IPoint[] = calculateInternalPoints(internalPoints, height / 2);


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


    /// Si tengo dos puntos solamente dibujo una seccion
    if (points.length === 2) {
        const uVectorX = (points[1].x - points[0].x) / Math.sqrt(Math.pow(points[1].x - points[0].x, 2) + Math.pow(points[1].y - points[0].y, 2));
        const uVectorY = (points[1].y - points[0].y) / Math.sqrt(Math.pow(points[1].x - points[0].x, 2) + Math.pow(points[1].y - points[0].y, 2));
        const uVector = { x: uVectorX, y: uVectorY };

        const uVectorNormal = { x: uVector.y, y: uVector.x * -1 };

        for (let i = 0; i < points.length; i++) {
            const vector1 = i % 2 === 0 ? uVector : { x: uVector.x * -1, y: uVector.y * -1 };


            const dX = points[i].x + frameHeight / Math.sqrt(Math.pow(vector1.x, 2) + Math.pow(vector1.y, 2)) * vector1.x;
            const dY = points[i].y + frameHeight / Math.sqrt(Math.pow(vector1.x, 2) + Math.pow(vector1.y, 2)) * vector1.y;

            /// El punto d se traslada en la direccion del vector unitario B->C la distancia del cateto opuesto (altura del marco)
            const finalX = dX + frameHeight / Math.sqrt(Math.pow(uVectorNormal.x, 2) + Math.pow(uVectorNormal.y, 2)) * uVectorNormal.x;
            const finalY = dY + frameHeight / Math.sqrt(Math.pow(uVectorNormal.x, 2) + Math.pow(uVectorNormal.y, 2)) * uVectorNormal.y;

            internalPoints.push({ x: finalX, y: finalY });
        }
    }


    // const centroid = calculateCentroid(points);

    // if (internalPoints.length > 1) circles.push(<Circle key={randomId()} x={centroid.x} y={centroid.y} radius={3} fill="green" />);


    /// Dibujo los lados
    if (internalPoints.length >= 2) {
        for (let i = 0; i < points.length; i++) {
            const a = points[i];
            const b = points[(i + 1) % points.length];

            const c = internalPoints[(i + 1) % internalPoints.length];
            const d = internalPoints[i];

            if (a && b && c && d)
                sections.push(<Section key={randomId()} points={[a, b, c, d]} />);

        }
    }


    const rectangle = isRectangle(internalPoints);
    const verticalFrames: { corners: IRectangle, component: JSX.Element }[] = [];
    const horizontalFrames: { corners: IRectangle, component: JSX.Element }[] = [];

    /// Calculo de marcos internos
    if (points.length === 4 && rectangle) {
        const rectangleWidth = rectangle.topRight.x - rectangle.topLeft.x;
        const rectangleHeight = rectangle.bottomLeft.y - rectangle.topLeft.y;

        const sectionWidth = rectangleWidth / horizontalSections;


        for (let i = 1; i < horizontalSections; i++) {
            const topLeft = { x: rectangle.topLeft.x + i * sectionWidth - frameHeight / 2, y: rectangle.topLeft.y };
            const topRight = { x: rectangle.topLeft.x + i * sectionWidth + frameHeight / 2, y: rectangle.topLeft.y };
            const bottomRight = { x: rectangle.topLeft.x + i * sectionWidth + frameHeight / 2, y: rectangle.bottomLeft.y };
            const bottomLeft = { x: rectangle.topLeft.x + i * sectionWidth - frameHeight / 2, y: rectangle.bottomLeft.y };

            texts.push(<Text key={randomId()} x={topLeft.x} y={topLeft.y} text={'H' + i.toString()} fontSize={12} />);
            verticalFrames.push({
                corners: { topLeft, topRight, bottomRight, bottomLeft },
                component: <Section key={randomId()} points={[topLeft, topRight, bottomRight, bottomLeft]} />
            }
            );

        }


        const sectionHeight = rectangleHeight / verticalSections;
        for (let i = 0; i < (verticalSections - 1) * horizontalSections; i++) {

            const leftX = rectangle.topLeft.x + (i % horizontalSections) * sectionWidth + (i % horizontalSections !== 0 ? frameHeight / 2 : 0);
            const topY = rectangle.topLeft.y + sectionHeight * Math.ceil((i + 1) / horizontalSections) - frameHeight / 2;
            const bottomY = rectangle.topLeft.y + sectionHeight * Math.ceil((i + 1) / horizontalSections) + frameHeight / 2;
            const rightX = rectangle.topLeft.x + (i % horizontalSections) * sectionWidth + sectionWidth - (i % horizontalSections !== horizontalSections - 1 ? frameHeight / 2 : 0);

            const topLeft = { x: leftX, y: topY };
            const topRight = { x: rightX, y: topY };
            const bottomRight = { x: rightX, y: bottomY };
            const bottomLeft = { x: leftX, y: bottomY };


            // circles.push(<Circle key={randomId()} x={topLeft.x} y={topLeft.y} radius={3} fill="red" draggable />);
            // circles.push(<Circle key={randomId()} x={topRight.x} y={topRight.y} radius={3} fill="green" draggable />);
            // circles.push(<Circle key={randomId()} x={bottomRight.x} y={bottomRight.y} radius={3} fill="blue" draggable />);
            // circles.push(<Circle key={randomId()} x={bottomLeft.x} y={bottomLeft.y} radius={3} fill="yellow" draggable />);

            texts.push(<Text key={randomId()} x={topLeft.x} y={topLeft.y} text={'V' + i.toString()} fontSize={12} />);

            horizontalFrames.push({
                corners: { topLeft, topRight, bottomRight, bottomLeft },
                component: <Section key={randomId()} points={[topLeft, topRight, bottomRight, bottomLeft]} />
            });
        }



        /// Vidrios 
        let glassCount = 0;
        for (let i = 0; i < verticalSections; i++) {
            for (let j = 0; j < horizontalSections; j++) {
                const topLeft = { x: j === 0 ? rectangle.topLeft.x : verticalFrames[j - 1].corners.topRight.x, y: i === 0 ? rectangle.topLeft.y : horizontalFrames[(i - 1) * horizontalSections + j].corners.bottomLeft.y };
                const topRight = { x: j === horizontalSections - 1 ? rectangle.topRight.x : verticalFrames[j].corners.topLeft.x, y: i === 0 ? rectangle.topRight.y : horizontalFrames[(i - 1) * horizontalSections + j].corners.bottomRight.y };
                const bottomRight = { x: j === horizontalSections - 1 ? rectangle.bottomRight.x : verticalFrames[j].corners.bottomLeft.x, y: i === verticalSections - 1 ? rectangle.bottomRight.y : horizontalFrames[i * horizontalSections + j].corners.topRight.y };
                const bottomLeft = { x: j === 0 ? rectangle.bottomLeft.x : verticalFrames[j - 1].corners.bottomRight.x, y: i === verticalSections - 1 ? rectangle.bottomLeft.y : horizontalFrames[i * horizontalSections + j].corners.topLeft.y };

                // circles.push(<Circle key={randomId()} x={topLeft.x} y={topLeft.y} radius={10} fill="red" draggable />);
                // circles.push(<Circle key={randomId()} x={topRight.x} y={topRight.y} radius={10} fill="green" draggable />);
                // circles.push(<Circle key={randomId()} x={bottomRight.x} y={bottomRight.y} radius={10} fill="blue" draggable />);
                // circles.push(<Circle key={randomId()} x={bottomLeft.x} y={bottomLeft.y} radius={10} fill="yellow" draggable />);
                const internal = [topLeft, topRight, bottomRight, bottomLeft];
                const glassPoints: IPoint[] = calculateInternalPoints(internal, frameHeight / 2);

                for (let i = 0; i < internal.length; i++) {
                    const a = internal[i];
                    const b = internal[(i + 1) % internal.length];

                    const c = glassPoints[(i + 1) % glassPoints.length];
                    const d = glassPoints[i];

                    if (a && b && c && d)
                        sections.push(<Section key={randomId()} points={[a, b, c, d]} />);

                }

                glass.push(<Glass key={randomId()} points={glassPoints} text={glassCount.toString()} />);
                glassCount++;

            }
        }


    }

    return (
        <Group>
            {sections}
            {verticalFrames.map(f => f.component)}
            {horizontalFrames.map(f => f.component)}
            {glass}
            {/* {lines} */}
            {circles}
            {texts}

        </Group>
    );
};

export default Test;