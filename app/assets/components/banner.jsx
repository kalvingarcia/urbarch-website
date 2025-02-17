"use client";
import Image from 'next/image';
import  {useEffect, useState} from 'react';
import {tss} from 'tss-react';
import {useTheme} from './theme';

const useStyles = tss.create(({theme}) => ({
    banner: {
        width: "100%",
        height: "400px",
        position: "relative",
        overflow: "hidden",
        clip: "inset(0 0 0 0)",
        color: theme.lightFont
    },
    parallaxContainer: {
        width: "100%",
        height: "100%",
        overflow: "hiddent",
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
        opacity: 0.75
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
        textAlign: "center"
    }
}));

export default function Banner({src, children}) {
    const [image, setImage] = useState(null);
    useEffect(() => {
        (async () => {
            setImage((await import(`../images/backgrounds/${src}`)).default);
        })();
    }, [src]);

    const theme = useTheme();
    const {classes} = useStyles({theme});
    return (
        <section className={classes.banner}>
            <figure className={classes.parallaxContainer}>
                {image && <Image className={classes.parallaxImage} src={image} alt="Banner image" />}
            </figure>
            <div className={classes.overlay} />
            <div className={classes.content}>
                {children}
            </div>
        </section>
    );
}