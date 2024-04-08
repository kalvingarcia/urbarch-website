"use client"
import React, {useCallback} from 'react';
import "../assets/styles/components/button.scss";

export default function Button({className, role = "primary", style = "filled", onPress, children}) {
    // Here we have the onMouseDown, which will be just the ripple animation
    // The goal is to have the circle grow slowly as the user holds the button
    const onMouseDown = useCallback(event => {
        const button = event.currentTarget; // We find the button being used

        // We create a circle
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2

        // We set the styles for the circle
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add("ripple");

        // We check if there is already a ripple on the button
        const ripple = button.getElementsByClassName("ripple")[0];
        if(ripple)
            ripple.remove(); // We remove any ripples already on the button

        button.appendChild(circle); // We add our new ripple
    }, []); // Ideally this callback should only be recached if the style changes for some reason

    // Here we complete the ripple effect by speeding up the scaling and fading the circle away
    // when the user lifts the mouse button
    const onMousUp = useCallback(event => {
        const button = event.currentTarget; // Finding our button

        const ripple = button.getElementsByClassName("ripple")[0]; // checking if there is a ripple in place
        if(ripple)
            ripple.classList.add("fade"); // adding the fade style to the ripple
    }, []);

    return (
        <button className={["button", role, style, className? className : ""].join(" ")} onMouseDown={onMouseDown} onMouseUp={onMousUp} onClick={onPress}>
            {children}
        </button>
    );
}