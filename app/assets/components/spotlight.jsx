"use client"
import {useState, useEffect, cloneElement, useCallback, Children} from "react";

function Stage({spotlight = false, mini = false, onClick, children}) {
    const handleClick = useCallback(() => {
        if(mini)
            onClick();
    }, [mini]);
    
    return (
        <figure className={["stage", spotlight? "spotlight" : "", mini? "mini" : ""].join(" ")} onClick={handleClick}>
            {children}
        </figure>
    );
}

export default function Spotlight({children}) {
    const [activeStage, setActiveStage] = useState(0);
    const [stages, setStages] = useState(() => {
        const imageList = Children.toArray(children);
        let count = 0;
        return imageList.map(image => (
            <Stage key={count} onClick={() => setActiveStage(count++)}>{image}</Stage>
        ));
    });

    useEffect(() => {
        let count = 0;
        setStages(stages.map(stage => (
            cloneElement(stage, {spotlight: activeStage === count++})
        )));
    }, [activeStage]);

    return (
        <div>
            {stages[activeStage]}
            <div>
                {stages.map(stage => (
                    cloneElement(stage, {mini: true})
                ))}
            </div>
        </div>
    )
}