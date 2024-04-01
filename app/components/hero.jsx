import Image from 'next/image';
import React from 'react';
import {createUseStyles} from 'react-jss';
import background from '../assets/backgrounds/home.png';

const useStyles = createUseStyles({
    hero: {
        width: "100%",
        height: "100vh",
        position: "relative"
    },
    parallaxContainer: {
        height: "100%",
        overflow: "hidden",
        clipPath: "inset(0 0 0 0)"
    },
    parallaxImage: {
        height: "100%",
        width: "auto",
        objectFit: "cover",
        objectPosition: "center",
        position: "fixed"
    },
    gradient: {
        backgroundImage: "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)",
        height: "100%",
        width: "100%",
        position: "absolute",
        top: "0",
        left: "0"
    },
    heading: {
        maxWidth: "1280px",
        position: "absolute",
        bottom: "0",
        marginLeft: "max(calc(max(100vw - 1280px, 0px) / 2), 25px)",
        marginBottom: "100px",

        color: "white",
        fontSize: "100px",
    }
});

export default function Hero() {
    const styles = useStyles();
    return (
        <section className={styles.hero}>
            <figure className={styles.parallaxContainer}>
                <Image className={styles.parallaxImage} src={background} alt="Hompage background image" priority/>
            </figure>
            <div className={styles.gradient} />
            <div className={styles.heading}>Knobs are really cool!</div>
        </section>
    );
}
