import { Group } from "react-konva";
import { WindowModel } from "../models/WindowModel";
import { Side } from "./Side";
import { Glass2 } from "./Glass2";
import { Crossbar } from "./Crossbar";


const Window = ({ window }: { window: WindowModel }) => {
    


    return (
        <Group>
            {window.sides.map((side, index) => <Side key={'side-'+index} side={side}/>)}
            {window.horizontalCrossbars.map((crossbar, index) => <Crossbar key={'crossbar-'+index} crossbar={crossbar} />)}
            {window.verticalCrossbars.map((crossbar, index) => <Crossbar key={'crossbar-'+index} crossbar={crossbar} />)}
            {window.glasses.map((glass, index) => <Glass2 key={'glass-'+index} glass={glass}/>)}
        </Group>
    );
};

export default Window;