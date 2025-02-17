"use client";
import Image from 'next/image';
import  {useCallback, useEffect, useState} from 'react';
import {tss} from 'tss-react';
import Icon from './icon-comp';
import {useTheme} from './theme';

const useStyles = tss.create(({theme, hide}) => ({
    hero: {
        width: "100%",
        height: "100vh",
        position: "relative",

        color: theme.lightFont,

        "& *": {
            transition: "opacity 300ms ease-in-out"
        }
    },
    parallaxContainer: {
        width: "100%",
        height: "100%",
        overflow: "hidden",
        clipPath: "inset(0 0 0 0)",
        position: "absolute",
        inset: 0
    },
    parallaxImage: {
        minWidth: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
        position: "fixed",
        top: 0
    },
    overlay: {
        backgroundColor: theme.darkFont,
        width: "100%",
        height: "100%",
        position: "absolute",
        inset: 0,
        opacity: hide? 0 : 0.5
    },
    content: {
        width: "100%",
        height: "100%",
        padding: "40px",
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        textAlign: "center",
        opacity: hide? 0 : 1
    },
    visibility: {
        position: "absolute",
        bottom: "40px",
        right: "40px"
    },
}));

export default function Hero({src, children}) {
    const [image, setImage] = useState(null);
    useEffect(() => {
        (async () => {
            setImage((await import(`../images/backgrounds/${src}`)).default);
        })();
    }, [src]);

    // Here we have a callback for showing the hero content on mouse move
    const [hide, setHide] = useState(true);

    const theme = useTheme();
    const {classes} = useStyles({theme, hide});
    return (
        <section className={classes.hero} onMouseMove={() =>  setHide(false)}>
            <figure className={classes.parallaxContainer}>
                {image && <Image className={classes.parallaxImage} src={image} alt="Hompage background image" />}
            </figure>
            <div className={classes.overlay} />
            <div className={classes.content}>
                {children}
            </div>
            <div className={classes.visibility}>
                <Icon role="secondary" appearance="outlined" button icon={hide? "visibility" : "visibility_off"} onPress={() => setHide(!hide)}/>
            </div>
        </section>
    );
}
