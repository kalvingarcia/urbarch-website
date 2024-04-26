"use client"
import {useEffect, useState} from "react";

export default function DropdownMenu({name, choices}) {
    console.log(choices);
    const [currentChoice, setCurrentChoice] = useState(() => (
        choices.findIndex(choice => choice.default)
    ));
    const [options, setOptions] = useState(() => (
        choices.map((choice, _, choices) => ({
            display: choice.display,
            differenceToCurrent: choice.difference - choices[currentChoice].difference,
            differenceToBase: choice.difference
        }))
    ));

    useEffect(() => {
        setOptions(options.map((option, _, options) => ({
            ...option,
            differenceToCurrent: option.differenceToBase - options[currentChoice].differenceToBase
        })));
    }, [currentChoice]);

    return (
        <div className="dropdown-menu">
            <span className="name">{name}</span>
            <span className="display">{options[currentChoice].display}</span>
            <div className="menu">
                {options.map(option => (
                    <span key={option.display}>{option.display} {Math.sign(option.differenceToCurrent) === -1? "-" : ""}(${option.differenceToCurrent})</span>
                ))}
            </div>
        </div>
    );
}