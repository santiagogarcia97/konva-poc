import { Group } from "react-konva";
import { WindowModel } from "../models/WindowModel";
import { Side } from "./Side";
import { Crossbar } from "./Crossbar";
import { Glass } from "./Glass";


const Window = ({ window }: { window: WindowModel }) => {
    


    return (
        <Group>
            {window.sides.map((side, index) => <Side key={'side-'+index} side={side}/>)}
            {window.horizontalCrossbars.map((crossbar, index) => <Crossbar key={'crossbar-'+index} crossbar={crossbar} />)}
            {window.verticalCrossbars.map((crossbar, index) => <Crossbar key={'crossbar-'+index} crossbar={crossbar} />)}
            {window.glasses.map((glass, index) => <Glass key={'glass-'+index} glass={glass}/>)}
        </Group>
    );
};

export default Window;