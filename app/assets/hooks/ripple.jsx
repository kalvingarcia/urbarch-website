"use client"
import {useCallback} from "react";
import {tss, keyframes} from 'tss-react';

const rippleEffect = keyframes`
    to {
        transform: scale(4);
    }
`
const fadeEffect = keyframes`
    to {
        opacity: 0;
    }
`
console.log(tss);
const useStyles = tss.create({
    ripple: {
        position: "fixed",
        pointerEvents: "none",
        borderRadius: "50%",
        opacity: 0.3,
        transform: "scale(0)",
        animation: `${rippleEffect} 1800ms forwards`,
        "&.fade": {
            animation: `${rippleEffect} 1200ms forwards, ${fadeEffect} 600ms forwards`
        }
    }
});

export default function useRippleEffect() {
    const rippleClass = useStyles().classes.ripple;

    const rippleExpand = useCallback(event => {
        const target = event.currentTarget;

        const circle = document.createElement("span");
        const diameter = Math.max(target.clientWidth, target.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - radius}px`;
        circle.style.top = `${event.clientY - radius}px`;
        circle.classList.add(rippleClass);

        // const ripple = target.getElementsByClassName(rippleClass)[0];
        // if(ripple) ripple.remove();

        target.appendChild(circle);
        event.stopPropagation();
    }, []);

    const rippleFade = useCallback(event => {
        const target = event.currentTarget;

        // const ripple = target.getElementsByClassName(rippleClass)[0];
        // if(ripple) {
        //     ripple.classList.add("fade");
        //     setTimeout(() => ripple?.remove(), 600);
        // }
        [...target.getElementsByClassName(rippleClass)].map(ripple => {
            ripple.classList.add("fade");
            setTimeout(() => ripple?.remove(), 600);
        });

        event.stopPropagation();
    }, []);

    return [rippleClass, rippleExpand, rippleFade];
}