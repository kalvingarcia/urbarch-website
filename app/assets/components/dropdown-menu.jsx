"use client"
import {useCallback, useEffect, useState, useRef, useContext} from "react";
import {Subheading} from "./typography";
import {OptionsContext} from "./product-data";

import '../styles/components/dropdown-menu.scss';
import useRippleEffect from "../hooks/ripple";

export default function DropdownMenu({name, choices, linkName, linkValue, updateChoiceValues, onChange}) {
    const [rippleExpand, rippleFade] = useRippleEffect();

    const [currentChoice, setCurrentChoice] = useState(() => (
        choices.findIndex(choice => choice.default)
    ));
    choices = choices.map((choice, index, choices) => {
        const links = choice.display.match(/\${([A-z\-\[\] ]+,?)+}/g);
        const display = choice.display.replace(/ \${([A-z\-\[\] ]+,?)+}/g, "");

        return {
            value: choice.value? choice.value : display,
            links: links? links[0].replace(/\${|}/g, "").split(",") : [],
            display: display,
            differenceToCurrent: choice.difference - choices[currentChoice].difference,
            differenceToBase: choice.difference,
            onClick: () => setCurrentChoice(index)
        }
    });

    const [options, setOptions] = useState(() => {
        let options = [];
        for(let choice of choices) {
            if(choice.links.length !== 0 && linkValue && !choice.links.includes(linkValue))
                continue;
            options.push(choice);
        }
        return options;
    });
    useEffect(() => {
        onChange(choices[currentChoice].differenceToCurrent);
        updateChoiceValues(name, choices[currentChoice].value);

        let options = [];
        for(let choice of choices) {
            if(choice.links.length !== 0 && linkValue && !choice.links.includes(linkValue))
                continue;
            options.push({
                ...choice,
                differenceToCurrent: choice.differenceToBase - choices[currentChoice].differenceToBase
            });
        }
        setOptions(options);
    }, [currentChoice]);
    useEffect(() => {
        let options = [];
        for(let choice of choices) {
            if(choice.links.length !== 0 && linkValue && !choice.links.includes(linkValue))
                continue;
            options.push(choice);
        }
        setOptions(options);
    }, [linkValue]);

    const after = useCallback(() => {
        if(linkName !== "") {
            const pseudoParent = document.getElementById(linkName);
            const self = document.getElementById(name);
            if(pseudoParent)
                pseudoParent.after(self);
        }
    }, []);

    const [open, setOpen] = useState(false);
    return (options.length !== 0?
        <div id={name} ref={after} className="dropdown-menu">
            <Subheading>{name}</Subheading>
            <span className="display" onClick={() => setOpen(!open)} onMouseDown={rippleExpand} onMouseUp={rippleFade}>
                {choices[currentChoice].display} ({Math.sign(choices[currentChoice].differenceToCurrent) === -1? "-" : "+"}${Math.abs(choices[currentChoice].differenceToCurrent)})
            </span>
            <div className={["modal", open? "open" : ""].join(" ")}>
                <div className="scrim" onMouseDown={() => setOpen(false)} />
                <div className="menu">
                    {options.map(option => (
                        <span className="option" key={option.display + option.differenceToBase} onClick={() => option.onClick() || setOpen(false)}>
                            {option.display} ({Math.sign(option.differenceToCurrent) === -1? "-" : "+"}${Math.abs(option.differenceToCurrent)})
                        </span>
                    ))}
                </div>
            </div>
        </div>
        :
        ""
    );
}