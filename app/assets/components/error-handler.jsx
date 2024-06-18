'use client'
import {createContext, useCallback, useState} from "react";
import Snackbar from './snackbar';
import Modal from "./modal";

export const ErrorContext = createContext();

const ERROR_MESSAGE_DEFAULT = "Uh oh! An error occured.";

export default function ErrorHandler({children}) {
    const [snackbar, setSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState(ERROR_MESSAGE_DEFAULT);
    const triggerErrorMessage = useCallback((message = undefined) => {
        setErrorMessage(ERROR_MESSAGE_DEFAULT);
        if(message)
            setErrorMessage(message);
        setSnackbar(true);
    }, [snackbar]);

    const [report, setReport] = useState(false);
    const sendErrorReport = useCallback(() => {
        // setReport(true);
    }, [report]);

    return (
        <ErrorContext.Provider value={triggerErrorMessage}>
            <Snackbar open={snackbar} setOpen={setSnackbar} message={errorMessage} action={{icon: "bug_report", callback: sendErrorReport}} />
            <Modal open={report} setOpen={setReport}>
            </Modal>
            {children}
        </ErrorContext.Provider>
    );
}