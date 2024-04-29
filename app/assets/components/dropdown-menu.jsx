"use client"
import {useCallback, useEffect, useState, useRef} from "react";
import {Subheading} from "./typography";

import '../styles/components/dropdown-menu.scss';
import useRippleEffect from "../hooks/ripple";

export default function DropdownMenu({name, choices, onChange}) {
    const [rippleExpand, rippleFade] = useRippleEffect();

    const [currentChoice, setCurrentChoice] = useState(() => (
        choices.findIndex(choice => choice.default)
    ));
    const [options, setOptions] = useState(() => (
        choices.map((choice, index, choices) => ({
            display: choice.display,
            differenceToCurrent: choice.difference - choices[currentChoice].difference,
            differenceToBase: choice.difference,
            onClick: () => setCurrentChoice(index)
        }))
    ));

    useEffect(() => {
        onChange(options[currentChoice].differenceToCurrent);
        setOptions(options.map((option, _, options) => ({
            ...option,
            differenceToCurrent: option.differenceToBase - options[currentChoice].differenceToBase
        })));
    }, [currentChoice]);

    const [open, setOpen] = useState(false);
    const timer = useRef();
    const handleMouseEnter = useCallback(() => {
        if(timer.current)
            clearTimeout(timer.current);
    }, []);
    const handleMouseLeave = useCallback(() => {
        timer.current = setTimeout(() => setOpen(false));
    }, []);

    return (
        <div className="dropdown-menu">
            <Subheading>{name}</Subheading>
            <span className="display" onClick={() => setOpen(!open)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseDown={rippleExpand} onMouseUp={rippleFade}>
                {options[currentChoice].display} ({Math.sign(options[currentChoice].differenceToCurrent) === -1? "-" : "+"}${Math.abs(options[currentChoice].differenceToCurrent)})
            </span>
            <div className={["menu", open? "open" : ""].join(" ")} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                {options.map(option => (
                    <span className="option" key={option.display} onClick={() => option.onClick() || setOpen(false)}>
                        {option.display} ({Math.sign(option.differenceToCurrent) === -1? "-" : "+"}${Math.abs(option.differenceToCurrent)})
                    </span>
                ))}
            </div>
        </div>
    );
}