import useAppStore from "../store";

const Tools = () => { 
    const state = useAppStore();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        state.setStrokeWidth(Number(e.target.value));
    }

    return (
        <div className="h-16 w-full bg-gray-300 absolute top-0 flex flex-row items-center px-4"> 
            <button className="btn btn-blue" onClick={() => state.clearDrawings() }>Borrar</button>

            <input className="btn ml-4" type='number' min={1} max={30} value={state.strokeWidth} onChange={onChange} />
        </div>
        );
}

export default Tools;   