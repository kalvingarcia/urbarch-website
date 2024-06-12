import {createPortal} from "react-dom";
import IconButton from "./icon-button";
import '../styles/components/modal.scss';

export default function Modal({open, setOpen, children}) {
    return (open?
        createPortal(
            <div className="modal">
                <div className="scrim" onClick={() => setOpen(false)} />
                <div className="pop-up">
                    {children}
                </div>
            </div>,
            document.getElementsByClassName("root")[0]
        )
        :
        ""
    );
}