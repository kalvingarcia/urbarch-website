"use client"
import {useState, useEffect, useCallback} from 'react';

export default function useProgressBar() {
    const [active, setActive] = useState(false);
    const [progressBarStatus, setProgressBarStatus] = useState("inactive");

    const checkUp = useCallback(() => {
        if(progressBarStatus === 'complete')
            setTimeout(() => {
                setProgressBarStatus("waiting");
            }, 1000);
        else if(progressBarStatus === 'loading') {
            if(!active)
                setTimeout(() => {
                    if(!active) {
                        setProgressBarStatus('complete');
                        checkUp();
                    } else
                        checkUp();
                }, 200);
            else
                setTimeout(() => {
                    checkUp();
                }, 50);
        } else {
            if(active)
                setTimeout(() => {
                    if(active) {
                        setProgressBarStatus("loading");
                        checkUp();
                    } else
                        setProgressBarStatus("waiting");
                }, 100);
            else
                setProgressBarStatus("waiting");
        }
    }, [progressBarStatus, active]);

    const progressBarFetch = useCallback(async (url, options) => {
        setActive(true);
        setProgressBarStatus("start");
        checkUp();
        const response = await fetch(url, options);
        setActive(false);

        if(response.status < 200 || response.status >= 300)
            return new Error(response.statusText);

        return response.json();
    }, []);

    return {progressBarStatus, progressBarFetch};
}