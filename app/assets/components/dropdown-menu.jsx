"use client"
import {useCallback, useEffect, useState, useRef, useContext} from "react";
import {Subheading} from "./typography";
import {OptionsContext} from "./product-data";

import '../styles/components/dropdown-menu.scss';
import useRippleEffect from "../hooks/ripple";

export default function DropdownMenu({name, choices, updatePrice}) {
    const [rippleExpand, rippleFade] = useRippleEffect();

    const [currentChoice, setCurrentChoice] = useState(0);
    choices = choices.map((choice, index) => ({
            id: choice.id,
            display: choice.display,
            value: parseFloat(choice.value),
            onClick: () => setCurrentChoice(index) || updatePrice(parseFloat(choice.value))
    }));

    const [open, setOpen] = useState(false);
    return (
        <div id={name} className={["dropdown-menu"].join(" ")}>
            <div className="name">
                <Subheading>{name}</Subheading>
            </div>
            <span className="display" onClick={() => setOpen(!open)} onMouseDown={rippleExpand} onMouseUp={rippleFade}>
                {choices[currentChoice].display}
            </span>
            <div className={["dropdown", open? "open" : ""].join(" ")}>
                <div className="close-menu" onMouseDown={() => setOpen(false)} />
                <div className="menu">
                    {choices.map(choice => (
                        <span className="option" key={choice.id} onClick={() => choice.onClick() || setOpen(false)}>
                            {choice.display} <span className="price">({choice.value === Infinity? "Call for Pricing" : `$${Math.abs(choice.value).toLocaleString('en', {useGrouping: true})}`})</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}