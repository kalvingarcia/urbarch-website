import {createPortal} from "react-dom";
import {tss} from "tss-react";
import {useTheme} from "./theme";

const useStyles = tss.create(({theme}) => ({
    modal: {
        position: "absolute",
        zIndex: 1000
    },
    scrim: {
        position: "fixed",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        opacity: 0.75,
        backgroundColor: theme.darkFont
    },
    popUp: {
        backgroundColor: theme.primary,
        color: theme.onPrimary,
        position: "fixed",
        width: "80%",
        maxWidth: "1000px",
        height: "80%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "40px",
        borderRadius: "20px",
        overflow: "hidden",
        overflowY: "scroll"
    }
}));

export default function Modal({open, setOpen, children}) {
    const theme = useTheme();
    const {classes} = useStyles({theme});
    return (open && createPortal(
        <div className={classes.modal}>
            <div className={classes.scrim} onClick={() => setOpen(false)} />
            <div className={classes.popUp}>
                {children}
            </div>
        </div>,
        document.getElementById("theme-root")
    ));
}