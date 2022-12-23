import { Layer, Line } from 'react-konva';

const Grid = ({ width, height }: { width: number, height: number }) => {

  const stepSize = 50; // set a value for the grid step gap.

  const lines = [];

  /// https://longviewcoder.com/2021/12/08/konva-a-better-grid/
  const xSize = width,
    ySize = height,
    xSteps = Math.round(xSize / stepSize),
    ySteps = Math.round(ySize / stepSize);

  // draw vertical lines
  for (let i = 0; i <= xSteps; i++) {
    lines.push(
      <Line
        key={'X' + i}
        x={i * stepSize}
        points={[0, 0, 0, ySize]}
        stroke='rgba(0, 0, 0, 0.2)'
        strokeWidth={1}
      />
    );
  }
  //draw Horizontal lines
  for (let i = 0; i <= ySteps; i++) {
    lines.push(
      <Line
        key={'Y' + i}
        y={i * stepSize}
        points={[0, 0, xSize, 0]}
        stroke='rgba(0, 0, 0, 0.2)'
        strokeWidth={1}
      />

    );
  }

  return (<Layer>{lines.map(e => e)}</Layer>);
};

export default Grid;