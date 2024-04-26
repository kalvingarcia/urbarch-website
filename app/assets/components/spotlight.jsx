"use client"
import {useState, useEffect, cloneElement, useCallback, Children} from "react";
import '../styles/components/spotlight.scss';

function Stage({lead = false, mini = false, onClick, children}) {
    const handleClick = useCallback(() => {
        if(mini)
            onClick();
    }, [mini]);

    return (
        <figure className={["stage", lead? "lead" : "", mini? "mini" : ""].join(" ")} onClick={handleClick}>
            {children}
        </figure>
    );
}

export default function Spotlight({children}) {
    const [activeStage, setActiveStage] = useState(0);
    const [stages, setStages] = useState(() => {
        const imageList = Children.toArray(children);
        return imageList.map((image, index) => (
            <Stage key={image.key} onClick={() => setActiveStage(index)}>{image}</Stage>
        ));
    });

    useEffect(() => {
        setStages(stages.map((stage, index) => (
            cloneElement(stage, {lead: activeStage === index})
        )));
    }, [activeStage]);

    return (
        <div className="spotlight">
            {stages[activeStage]}
            <div className="backstage">
                {stages.map(stage => (
                    cloneElement(stage, {mini: true})
                ))}
            </div>
        </div>
    )
}