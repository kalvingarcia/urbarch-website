import {createPortal} from "react-dom";
import {useEffect, useState} from "react";
import Icon from "./icon";
import "../styles/components/snackbar.scss";

const SNACKBAR_TIMEOUT = 5000;
const ANIMATION_TIME = 200;

export default function Snackbar({role = "primary", open, setOpen, message, action}) {
    const [state, setState] = useState("inactive");
    useEffect(() => {
        setState("inactive");
        if(open) {
            setState("enter");
            setTimeout(() => setOpen(false), SNACKBAR_TIMEOUT);
            setTimeout(() => {
                setState("active");
                setTimeout(() => setState("leave"), SNACKBAR_TIMEOUT - ANIMATION_TIME * 2);
            }, ANIMATION_TIME);
        }
    }, [open]);

    return (open?
        createPortal(
            <div className={["snackbar", state, role].join(" ")}>
                <span>{message}</span>
                <Icon role={role} appearance="text" button onPress={() => action.callback()} icon={action.icon} />
            </div>,
            document.getElementsByClassName("root")[0]
        )
        :
        ""
    );
}