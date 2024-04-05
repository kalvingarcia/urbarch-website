"use client"
import React, {useState, useEffect, useCallback} from 'react';
import {createUseStyles, useTheme} from 'react-jss';

const useStyles = createUseStyles({
    ripple: {},
    button: {
        outline: "none",
        border: ({outlined, font}) => outlined? `1pt solid ${font}` : "none",

        maxWidth: "fit-content",
        position: "relative",
        overflow: "hidden",
        padding: "10px 20px",

        backgroundColor: ({background}) => background,
        borderRadius: "200px",
        color: ({font}) => font,
        "&::after": {
            content: "''",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,

            backgroundColor: ({font}) => font,
            opacity: 0,
            transition: "opacity 300ms ease-in-out"
        },
        "&:hover": {
            "&::after": {
                opacity: 0.2
            }
        },

        "& $ripple": {
            position: "absolute",

            transform: "scale(0)",
            backgroundColor: ({font}) => font,
            borderRadius: "50%",
            opacity: 0.2,
            animation: "$ripple 1800ms forwards",
            "&.fade": {
                animation: "$fade 600ms forwards, $ripple 1200ms forwards",
            }
        }
    },
    "@keyframes ripple": {
        to: {
            transform: "scale(4)"
        }
    },
    "@keyframes fade": {
        to: {
            opacity: 0,
        }
    }
});

export default function Button({className, role, style, onPress, children}) {
    const theme = useTheme();
    const [background, setBackground] = useState(theme.onPrimary); // default primary filled button
    const [font, setFont] = useState(theme.primary); // default primary filled button
    const [outlined, setOutlined] = useState(false);

    // Styling the button based the on the role and style props
    useEffect(() => {
        switch(style) {
            case "filled": // high contrast button compared to the background
                setBackground(role == "primary"? theme.onPrimary : theme.onSecondary);
                setFont(role == "primary"? theme.primary : theme.secondary);
                break;
            case "tonal": // lower contrast button compared to the background
                setBackground(role == "primary"? theme.primary : theme.secondary);
                setFont(role == "primary"? theme.onPrimary : theme.onSecondary);
                break;
            case "outlined": // outlined button
                setBackground("transparent");
                setFont(role == "primary"? theme.onPrimary : theme.onSecondary);
                setOutlined(true);
                break;
            case "text": // plain text that's also a button
                setBackground("transparent");
                setFont(role == "primary"? theme.onPrimary : theme.onSecondary);
                break;
            default:
                setBackground(role == "primary"? theme.onPrimary : theme.onSecondary);
                setFont(role == "primary"? theme.primary : theme.secondary);
                break; // leave it as the filled button
        }
    }, [role, style]);


    const styles = useStyles({background, font, outlined});

    const onMouseDown = useCallback(event => {
        const button = event.currentTarget;

        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.pageX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.pageY - button.offsetTop - radius}px`;
        circle.classList.add(styles.ripple);

        const ripple = button.getElementsByClassName(styles.ripple)[0];
        if(ripple)
            ripple.remove();

        button.appendChild(circle);
    }, [styles.ripple]);

    const onMousUp = useCallback(event => {
        const button = event.currentTarget;

        const ripple = button.getElementsByClassName(styles.ripple)[0];
        if(ripple)
            ripple.classList.add("fade");
    }, [styles.ripple]);

    return (
        <button className={[styles.button, className? className : ""].join(" ")} onMouseDown={onMouseDown} onMouseUp={onMousUp} onClick={onPress}>
            {children}
        </button>
    );
}