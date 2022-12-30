import useAppStore from "../store";

const Tools = () => {
    //const clearDrawings = useAppStore(state => state.clearDrawings);
    //const setStrokeWidth = useAppStore(state => state.setStrokeWidth);
    //const strokeWidth = useAppStore(state => state.strokeWidth);
    const mousePosition = useAppStore(state => state.mousePosition);
    const setFrame = useAppStore(state => state.setFrame);

    /*
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFrame(null);
    }
    */

    return (
        <div className="h-16 w-full bg-gray-300 absolute top-0 flex flex-row items-center px-4">
            <button className="btn btn-blue" onClick={() => setFrame(null)}>Borrar</button>

            {/*<input className="btn ml-4" type='number' min={1} max={30} value={strokeWidth} onChange={onChange} /> */}

            {mousePosition && <div>X: {mousePosition.x} Y: {mousePosition.y}</div>}
        </div>
    );
}

export default Tools;   