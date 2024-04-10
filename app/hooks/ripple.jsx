"use client"
import {useCallback} from 'react';
import '../assets/styles/hooks/ripple.scss';

export default function useRippleEffect() {
    // Here we have the onMouseDown, which will be just the ripple animation
    // The goal is to have the circle grow slowly as the user holds the button
    const rippleExpand = useCallback(event => {
        const target = event.currentTarget; // We find the button being used

        // We create a circle
        const circle = document.createElement("span");
        const diameter = Math.max(target.clientWidth, target.clientHeight);
        const radius = diameter / 2

        // We set the styles for the circle
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - radius}px`;
        circle.style.top = `${event.clientY - radius}px`;
        circle.classList.add("ripple");

        // We check if there is already a ripple on the button
        const ripple = target.getElementsByClassName("ripple")[0];
        if(ripple)
            ripple.remove(); // We remove any ripples already on the button

        target.appendChild(circle); // We add our new ripple
    }, []); // Ideally this callback should only be recached if the style changes for some reason

    // Here we complete the ripple effect by speeding up the scaling and fading the circle away
    // when the user lifts the mouse button
    const rippleFade = useCallback(event => {
        const target = event.currentTarget; // Finding our button

        const ripple = target.getElementsByClassName("ripple")[0]; // checking if there is a ripple in place
        if(ripple)
            ripple.classList.add("fade"); // adding the fade style to the ripple
    }, []);

    return [rippleExpand, rippleFade];
}

