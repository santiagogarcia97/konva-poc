import useAppStore from "../store";

export const MousePosition = () => {
    const mousePosition = useAppStore(state => state.mousePosition);

    return (
        <div className="absolute top-0 right-0 p-2">Mouse X:{mousePosition?.x ?? '-'} Y:{mousePosition?.y ?? '-'}</div>
    );
}