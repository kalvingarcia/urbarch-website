"use client"
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {useEffect, useState} from 'react';
import {keyframes, tss} from 'tss-react';
import {useTheme} from './theme';
import useRippleEffect from '../hooks/ripple';

const loadingGradient = keyframes`
    0% {
        background-position: 0% 10%;
    }
    50% {
        background-position: 100% 90%;
    }
    100% {
        background-position: 0% 10%;
    }
`

const useStyles = tss.create(({theme, type, rippleClass}) => ({
    card: {
        width: type === "normal"? "300px" : type === "small"? "200px" : "100%",
        height: type === "normal"? "450px" : type === "small"? "300px" : "200px",
        display: "flex",
        flexDirection: type !== "list"? "column" : "row",
        overflow: "hidden",
        clipPath: "inset(0 0 0 0 round 20px)",
        position: "relative",
        borderRadius: "20px",
        backgroundColor: theme.primary,
        color: theme.onPrimary,

        "&.skeleton": {
            backgroundImage: `linear-gradient(135deg, ${theme.surface}, ${theme.body}51)`,
            backgroundPosition: "0% 0%",
            backgroundSize: "200% 200%",
            animation: `${loadingGradient} 3s infinite`,
            pointerEvents: "none"
        },

        "&::after": {
            content: "''",
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
            backgroundColor: theme.onPrimary,
            opacity: 0,
            transition: "background-color 300ms ease-in-out, opacity 300ms ease-in-out"
        },
        "&:hover": {
            "&::after": {
                opacity: 0.2
            }
        },

        [`& .${rippleClass}`]: {
            backgroundColor: theme.onPrimary
        }
    },
    image: {
        minWidth: "100px",
        width: type !== "list"? "100%" : "200px",
        height: type === "normal"? "300px" : type === "small"? "200px" : "100%",
        overflow: "hidden",
        clipPath: "inset(0 0 0 0)",
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        "&.skeleton": {
            backgroundColor: theme.background,
            opacity: 0.2
        },

        "& img": {
            width: type !== "list"? "auto" : "100%",
            height: type !== "list"? "100%" : "auto",
            objectFit: "cover",
            objectPosition: "center"
        },

        "@media (max-width: 600px)": {
            minWidth: "100px",
            width: "100px"
        }
    },
    content: {
        width: "100%",
        position: "relative",
        padding: type !== "small"? "20px" : "10px",
        whiteSpace: "nowrap",
        fontSize: type !== "small"? "1rem" : "0.75rem",
    },
    metadata: {
        display: "flex",
        flexDirection: "column",
        gap: "5px",
    },
    name: {
        maxWidth: type !== "list"? "none" : "200px",
        fontSize: type !== "small"? "1.25rem" : "1rem",
        fontWeight: "bold",
        overflow: "hidden",
        textOverflow: "ellipsis",

        "&.skeleton": {
            height: type !== "small"? "1.25rem" : "1rem",
            width: "50%",
            backgroundColor: theme.body,
            opacity: 0.2,
            borderRadius: "2000px"
        }
    },
    category: {
        fontSize: "0.8rem",
        padding: type !== "normal"? "5px 10px" : "10px 20px",
        borderRadius: "2000px",
        minWidth: "fit-content",
        maxWidth: "fit-content",
        backgroundColor: theme.onPrimary,
        color: theme.primary,

        "&.skeleton": {
            maxWidth: "20%",
            height: "1rem",
            opacity: 0.2
        }
    },
    price: {
        display: type !== "small"? "inline" : "none",

        "&.skeleton": {
            height: "1rem",
            width: "25%",
            backgroundColor: theme.body,
            opacity: 0.2,
            borderRadius: "2000px"
        }
    },
    uaid: {
        position: "absolute",
        bottom: type !== "small"? "20px" : "-15px",
        right: "20px",

        "&.skeleton": {
            height: "1rem",
            width: "50px",
            backgroundColor: theme.body,
            opacity: 0.2,
            borderRadius: "2000px"
        }
    }
}));

export function CardSkeleton({cx, classes}) {
    return (
        <div className={cx(classes.card, "skeleton")}>
            <div className={cx(classes.image, "skeleton")} />
            <div className={cx(classes.content, "skeleton")}>
                <div className={cx(classes.metadata, "skeleton")}>
                    <div className={cx(classes.name, "skeleton")} />
                    <div className={cx(classes.category, "skeleton")} />
                    <div className={cx(classes.price, "skeleton")} />
                </div>
                <div className={cx(classes.uaid, "skeleton")} />
            </div>
        </div>
    );
}

export default function Card({type = "normal", from, id, extension, name, subname, category, price}) {
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const timeout = setTimeout(async () => {
                setImage((await import("../images/unavailable.jpg")).default);
                setLoading(false);
            }, 5000);
            if(from === 'salvage')
                setImage((await import(`../images/${from}/${id}/${extension}/card.jpg`)).default);
            else
                setImage((await import(`../images/${from}/${id}/${extension}/card.jpg`)).default);
            clearTimeout(timeout);
            setLoading(false);
            
        })();
    }, [])

    const router = useRouter();
    const [rippleClass, rippleExpand, rippleFade] = useRippleEffect();
    const theme = useTheme();
    const {cx, classes} = useStyles({theme, type, rippleClass});
    return (loading?
        <CardSkeleton cx={cx} classes={classes} />
        :
        <div 
            className={classes.card} 
            onMouseDown={rippleExpand} onMouseUp={rippleFade}
            onClick={() => setTimeout(() => router.push(`/${from === 'products'? 'catalog' : 'salvage'}/${id}/${extension}`), 100)}
        >
            <div className={classes.image}>
                <Image src={image} alt="" />
            </div>
            <div className={classes.content}>
                <div className={classes.metadata}>
                    <span className={classes.name}>{name}{subname && subname !== ""? ` [${subname}]` : ''}</span>
                    <span className={classes.category}>{category}</span>
                    <span className={classes.price}>{price?.toString() === "Infinity"? "Call for pricing" : `${from === 'products'? "From " : ""}$${parseInt(price).toLocaleString('en', {useGrouping: true})}`}</span>
                </div>
                <span className={classes.uaid}>{id}{extension && extension !== 'NONE'? `-${extension}` : ''}</span>
            </div>
        </div>
    );
}