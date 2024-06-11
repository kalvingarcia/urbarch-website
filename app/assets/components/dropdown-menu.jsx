"use client"
import {useCallback, useEffect, useState, useRef, useContext} from "react";
import {Subheading} from "./typography";
import {OptionsContext} from "./product-data";

import '../styles/components/dropdown-menu.scss';
import useRippleEffect from "../hooks/ripple";

export default function DropdownMenu({name, choices, linkName = "", linkValue, updateChoiceValues}) {
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
        updateChoiceValues(name, choices[currentChoice].value, choices[currentChoice].differenceToBase);

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

        if(options.length === 0)
            updateChoiceValues(name, "None", 0);
        else if(options.every(option => option.value !== choices[currentChoice].value))
            options[0].onClick();
        else if(options.find(option => option.value === choices[currentChoice].value && option.onClick === choices[currentChoice].onClick))
            updateChoiceValues(name, choices[currentChoice].value, choices[currentChoice].differenceToBase);
        else {
            options.forEach(option => {
                if(option.value === choices[currentChoice].value && option.onClick !== choices[currentChoice].onClick)
                    option.onClick();
            });
        }
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
        <div id={name} ref={after} className={["dropdown-menu", linkName !== "" && linkName !== "finishes"? "dependent" : ""].join(" ")}>
            <div className="name">
                <Subheading>{name}</Subheading>
                {choices[currentChoice].differenceToBase > 0? 
                    <span className="difference">(+${choices[currentChoice].differenceToBase.toLocaleString('en', {useGrouping: true})} to starting price)</span>
                    :
                    ""
                }
            </div>
            <span className="display" onClick={() => setOpen(!open)} onMouseDown={rippleExpand} onMouseUp={rippleFade}>
                {choices[currentChoice].display} {/*<span className="price">({Math.sign(choices[currentChoice].differenceToCurrent) === -1? "-" : "+"}${Math.abs(choices[currentChoice].differenceToCurrent)} to current price)</span>*/}
            </span>
            <div className={["modal", open? "open" : ""].join(" ")}>
                <div className="scrim" onMouseDown={() => setOpen(false)} />
                <div className="menu">
                    {options.map(option => (
                        <span className="option" key={option.display + option.differenceToBase} onClick={() => option.onClick() || setOpen(false)}>
                            {option.display} <span className="price">({Math.sign(option.differenceToCurrent) === -1? "-" : "+"}${Math.abs(option.differenceToCurrent).toLocaleString('en', {useGrouping: true})} to current price)</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
        :
        ""
    );
}