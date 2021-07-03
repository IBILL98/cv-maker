import { useSelector } from "react-redux"
import { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"

import { jsPDF } from "jspdf";

import React from "react";
import html2canvas from 'html2canvas';


function CVEditor(props) {

    const mainPanel = useSelector(state => state.sections.mainPanel);
    const sidePanel = useSelector(state => state.sections.sidePanel);
    const side = useSelector(state => state.sections.side);
    const ref = useRef();
    const dispatch = useDispatch();

    const dragOver = (e) => {
        e.preventDefault();
    }

    useEffect(() => {
        if (sidePanel.length === 0) {
            dispatch({
                type: "CHANGE_SIDE",
                side: null
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(sidePanel)])



    /* const handlePrint = useReactToPrint({
         content: () => ref.current,
     });*/
    const printDocument = (e) => {
        const input = document.getElementById('s');
        html2canvas(input)
            .then((canvas) => {
                var contentWidth = canvas.width;
                var contentHeight = canvas.height;
                //One page pdf shows the canvas height generated by html pages.
                var pageHeight = contentWidth / 592.28 * 841.89;
                //html page height without pdf generation
                var leftHeight = contentHeight;
                //Page offset
                var position = 0;
                //a4 paper size [595.28, 841.89], html page generated canvas in pdf picture width
                var imgWidth = 595.28;
                var imgHeight = 592.28 / contentWidth * contentHeight;
                var pageData = canvas.toDataURL('image/jpeg', 1.0);
                var pdf = new jsPDF('', 'pt', 'a4');
                //There are two heights to distinguish, one is the actual height of the html page, and the page height of the generated pdf (841.89)
                //When the content does not exceed the range of pdf page display, there is no need to paginate
                if (leftHeight < pageHeight) {
                    pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
                } else {
                    while (leftHeight > 0) {
                        pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                        leftHeight -= pageHeight;
                        position -= 841.89;
                        //Avoid adding blank pages
                        if (leftHeight > 0) {
                            pdf.addPage();
                        }
                    }
                }
                pdf.save('content.pdf');
            })
            ;
    }



    return (
        <div id="s" className="cv-editor box" ref={ref} onDragOver={dragOver}>
            {side === "left" ?
                <div className="cv-side-panel cv-side-panel-left">
                    {sidePanel}
                </div>
                : null}
            <div className={`cv-main-panel ${side ? "cv-main-panel-tight" : ""}`}>
                {mainPanel}
                <hr className="split" />

                <button className="sectionBut" onClick={printDocument}>Print this out!</button>

            </div>
            {side === "right" ?
                <div className="cv-side-panel cv-side-panel-right">
                    {sidePanel}
                </div>
                : null}

        </div>

    );
}

export default CVEditor
