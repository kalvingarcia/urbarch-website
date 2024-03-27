import React from 'react';

export default function Hero() {
    const hero = {
        width: "100%",
        height: "100vh",
        position: "relative"
    }

    const parallax = {
        backgroundImage: `url('/background/home.png')`,
        height: "100%",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
    }

    const gradient = {
        backgroundImage: "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)",
        height: "100%",
        width: "100%",
        position: "absolute",
        top: "0",
        left: "0"
    }

    const heading = {
        maxWidth: "1280px",
        position: "absolute",
        bottom: "0",
        marginLeft: "max(calc(max(100vw - 1280px, 0px) / 2), 25px)",
        marginBottom: "100px",

        color: "white",
        fontSize: "100px",
    }

    return (
        <section style={hero}>
            <div style={parallax} />
            <div style={gradient} />
            <div style={heading}>Knobs are really cool!</div>
        </section>
    );
}
