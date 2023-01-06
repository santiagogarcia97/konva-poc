import { Circle, Layer, Line } from 'react-konva';
import { randomId } from '../helpers';

const Grid = ({ width, height }: { width: number, height: number }) => {

    const stepSize = 50; // set a value for the grid step gap.

    const lines = [];

    /// https://longviewcoder.com/2021/12/08/konva-a-better-grid/
    const xSize = width / 2,
        ySize = height / 2,
        xSteps = Math.ceil(xSize / stepSize),
        ySteps = Math.ceil(ySize / stepSize);

    // draw vertical lines
    for (let i = -xSteps; i <= xSteps; i++) {
        lines.push(
            <Line
                key={randomId()}
                x={i * stepSize}
                points={[0, -ySize, 0, ySize]}
                stroke='rgba(0, 0, 0, 0.2)'
                strokeWidth={1}
            />
        );
    }

    //draw Horizontal lines
    for (let i = -ySteps; i <= ySteps; i++) {
        lines.push(
            <Line
                key={randomId()}
                y={i * stepSize}
                points={[-xSize, 0, xSize, 0]}
                stroke='rgba(0, 0, 0, 0.2)'
                strokeWidth={1}
            />
        );
    }
    return (
        <Layer>
            {lines.map(e => e)}
            <Circle x={0} y={0} radius={3} fill='black' />
        </Layer>
    );
};

export default Grid;