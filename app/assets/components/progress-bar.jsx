import {useState, useEffect} from 'react';
import useProgressBar from "../hooks/progress-bar";
import '../styles/components/progress-bar.scss';

export default function ProgressBar() {
    const {progressBarStatus} = useProgressBar();
    const [width, setWidth] = useState(0);
    const [transition, setTransition] = useState("background-color 300ms ease-in-out");

    useEffect(() => {
        setWidth(progressBarStatus === 'complete'? '100%' : progressBarStatus === 'start'? 0 : "80%");
        setTransition(`background-color 300ms ease-in-out, width ${progressBarStatus === 'complete'? 0.8 : 30}ms ease-in`)
    }, [progressBarStatus]);

    if(progressBarStatus === 'waiting')
        return null;
    return (
        <div className="progress-bar">
            <div className="loading" style={{width, transition}} />
        </div>
    )
}