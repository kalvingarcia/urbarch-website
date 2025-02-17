"use client"
import {useState, useEffect} from 'react';
import {tss} from 'tss-react';
import {useTheme} from './theme';
import Icon from './icon';

const optionStyles = tss.create(({theme}) => ({
    option: {
        position: "relative",
        padding: "15px",

        "&::after": {
            content: "''",
            position: "absolute",
            width: "100%",
            height: "100%",
            inset: 0,
            opacity: 0,
            backgroundColor: theme.body
        },
        "&:hover::after": {
            opacity: 0.2
        }
    }
}));

function Option({display, value, onClick}) {
    const theme = useTheme();
    const {classes} = optionStyles({theme});
    return <div className={classes.option} onClick={() => onClick({display, value})}>{display}</div>;
}

const menuStyles = tss.create(({theme, height, flip}) => ({
    menu: {
        width: "100%",
        position: "relative",
    },
    display: {
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        borderRadius: "2000px",
        overflow: "hidden",
        border: `1pt solid ${theme.body + "7F"}`,
        backgroundColor: theme.surface + "7F",

        "&:focus": {
            outline: "none",
        },
        "&:focus::before": {
            outline: "none",
            opacity: 0.1
        },
        "&:focus-within": {
            borderColor: theme.onSecondary
        },
        "&::before": {
            content: "''",
            position: "absolute",
            inset: 0,
            opacity: 0,
            backgroundColor: theme.body
        },
        "&:hover::before": {
            opacity: 0.2
        },
    },
    arrow: {
        minWidth: "fit-content",
        minHeight: "fit-content",
        maxWidth: "fit-content",
        maxHeight: "fit-content",
        fontSize: "20px",
        padding: 0,
    },
    list: {
        width: "100%",
        height: `${height}px`,
        position: "absolute",
        bottom: flip? "52px" : null,
        overflow: "auto",
        borderRadius: "16px",
        border: `1pt solid ${theme.body + "7F"}`,
        backgroundColor: theme.surface,
        zIndex: 2,
        transition: "height 300ms ease"
    }
}));

export default function DropdownMenu({className, label, options, defaultOption, onChange}) {
    const [open, setOpen] = useState(false);
    const [display, setDisplay] = useState(defaultOption?.display?? "Select...");
    const handleSelect = option => {
        setDisplay(option.display);
        setOpen(false);
        onChange?.(option.value);
    }

    const [position, setPosition] = useState(undefined);
    const [height, setHeight] = useState(0);
    const [flip, setFlip] = useState(false);
    useEffect(() => {
        if(position && open) {
            const rect = position.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            const shouldFlip = spaceBelow < 200 && spaceAbove > spaceBelow;
            const maxHeight = shouldFlip ? Math.min(200, spaceAbove) : Math.min(200, spaceBelow);
            setHeight(maxHeight);
            if (flip !== shouldFlip) {
                setFlip(shouldFlip);
            }
        }
    }, [position, open, flip]);

    const [dropdown, setDropdown] = useState();
    const handleBlur = event => {
        if(event.target.value !== display) setDisplay(new String(display));
        if(event.relatedTarget !== dropdown)
            setHeight(0);
            setOpen(false);
    }

    const theme = useTheme();
    const {cx, classes} = menuStyles({theme, height, flip});
    return (
        <div id={label} className={cx(classes.menu, className)}>
            <div
                className={classes.display}
                tabIndex={0}
                onFocus={() => setOpen(true)}
                onBlur={handleBlur}
                onClick={() => setOpen(true)} 
            >
                <span>{display}</span>
                <Icon className={classes.arrow} icon={open? "arrow_drop_up" : "arrow_drop_down"} />
            </div>
            <div ref={setPosition}>{open &&
                <div ref={setDropdown} tabIndex={-1} className={classes.list}>
                    {options.map((option, index) => (
                        <Option key={index} display={option.display} value={option.value} onClick={handleSelect} />
                    ))}
                </div>
            }</div>
        </div>
    );
}
