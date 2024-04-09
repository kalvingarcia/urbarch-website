"use client"
import useRippleEffect from '../hooks/ripple';
import "../assets/styles/components/button.scss";

export default function Button({className, role = "primary", style = "filled", onPress, children}) {
    const [rippleExpand, rippleFade] = useRippleEffect();
    return (
        <button className={["button", role, style, className? className : ""].join(" ")} onMouseDown={rippleExpand} onMouseUp={rippleFade} onClick={onPress}>
            {children}
        </button>
    );
}