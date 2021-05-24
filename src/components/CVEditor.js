import { useSelector } from "react-redux"
import { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"

function CVEditor(props){
    const mainPanel = useSelector(state => state.sections.mainPanel);
    const sidePanel = useSelector(state => state.sections.sidePanel);
    const side = useSelector(state => state.sections.side);
    const ref = useRef();
    const dispatch = useDispatch();

    const dragOver = (e) => {
        e.preventDefault();
    }

    useEffect(() => {
        if (sidePanel.length === 0){
            dispatch({
                type: "CHANGE_SIDE",
                side: null
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(sidePanel)])

    return(
        <div className="cv-editor box" ref={ref} onDragOver={dragOver}>
            {side === "left" ?
            <div className="cv-side-panel">
                {sidePanel}
            </div>
            : null}
            <div className={`cv-main-panel ${side ? "cv-main-panel-tight" : ""}`}>
                {mainPanel}
            </div>
            {side === "right" ?
            <div className="cv-side-panel">
                {sidePanel}
            </div>
            : null}
        </div>
    );
}

export default CVEditor