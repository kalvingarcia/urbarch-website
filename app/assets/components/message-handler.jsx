'use client'
import {Children, createContext, useCallback, useState} from "react";
import Snackbar from './snackbar';
import Modal from "./modal";

export const MessageContext = createContext();

const ERROR_MESSAGE_DEFAULT = "Uh oh! An error occured.";

export default function MessageHandler({children}) {
    const [message, setMessage] = useState(ERROR_MESSAGE_DEFAULT);

    const [info, setInfo] = useState(false);
    const triggerInfoMessage = useCallback((message) => {
        setMessage(message);
        setInfo(true);
    });
    const close = useCallback(() => {
        setInfo(false);
    }, []);

    const [error, setError] = useState(false);
    const triggerErrorMessage = useCallback((message = undefined) => {
        setMessage(ERROR_MESSAGE_DEFAULT);
        if(message)
            setMessage(message);
        setError(true);
    }, []);

    return (
        <MessageContext.Provider value={{triggerInfoMessage, triggerErrorMessage}}>
            {children}
            <Snackbar role="error" open={error} setOpen={setError} message={message} action={{icon: "bug_report", callback: () => location.href = "https://forms.gle/6oKdNJisFe6cXYX58"}}/>
            <Snackbar role="primary" open={info} setOpen={setInfo} message={message} action={{icon: "close", callback: close}}/>
        </MessageContext.Provider>
    );
}