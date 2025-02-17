"use client"
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {useState, useEffect} from 'react';
import {tss, keyframes} from 'tss-react';
import {useTheme} from './theme';
import {CardSkeleton} from './card';
import {Heading} from './typography';
import useRippleEffect from '../hooks/ripple';
import Icon from './icon';

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

const cardStyles = tss.create(({theme, rippleClass}) => ({
    card: {
        width: "200px",
        height: "300px",
        display: "flex",
        flexDirection: "column",
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
        width: "100%",
        height: "200px",
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
            width: "auto",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center"
        }
    },
    content: {
        width: "100%",
        position: "relative",
        padding: "10px",
        whiteSpace: "nowrap",
        fontSize: "0.75rem",
    },
    metadata: {
        display: "flex",
        flexDirection: "column",
        gap: "5px",
    },
    name: {
        maxWidth: "none",
        fontSize: "1rem",
        fontWeight: "bold",
        overflow: "hidden",
        textOverflow: "ellipsis",

        "&.skeleton": {
            height: "1rem",
            width: "50%",
            backgroundColor: theme.body,
            opacity: 0.2,
            borderRadius: "2000px"
        }
    },
    category: {
        fontSize: "0.8rem",
        padding: "5px 10px",
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
    uaid: {
        position: "absolute",
        bottom: 0,
        right: "20px",

        "&.skeleton": {
            height: "1rem",
            width: "50px",
            backgroundColor: theme.body,
            opacity: 0.2,
            borderRadius: "2000px"
        }
    }
}))

export function Custom({id, productID, extension, name, customer, category}) {
    const [rippleClass, rippleExpand, rippleFade] = useRippleEffect();
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState("");

    useEffect(() => {
        (async () => {
            setLoading(true);
            setImage(await import(`../images/${from}/${id}/card.jpg`));
            setLoading(false);
        })();
    }, [])

    const router = useRouter();

    const theme = useTheme();
    const {cx, classes} = cardStyles({theme, rippleClass});
    return (loading?
        <CardSkeleton cx={cx} classes={classes} />
        :
        <div 
            className={classes.card} 
            onMouseDown={rippleExpand} onMouseUp={rippleFade}
            onClick={() => setTimeout(() => router.push(`/custom/${id}`), 100)}
        >
            <div className={classes.image}>
                <Image src={image} alt="" />
            </div>
            <div className={classes.content}>
                <div className={classes.metadata}>
                    <span className={classes.name}>{name}{customer !== ''? ` [${customer}]` : ''}</span>
                    <span className={classes.category}>{category}</span>
                </div>
                <span className={classes.uaid}>{productID}{extension !== 'DEFAULT'? `-${extension}` : ''}</span>
            </div>
        </div>
    );
}

const linkStyles = tss.create(({theme, rippleClass}) => ({
    card: {
        overflow: "hidden",
        clipPath: "inset(0 0 0 0 round 20px)",
        position: "relative",
        borderRadius: "20px",
        width: "200px",
        height: "300px",

        "&::after": {
            content: "''",
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            transition: "background-color 300ms ease-in-out, opacity 300ms ease-in-out",
            opacity: 0,
            backgroundColor: theme.lightFont
        },
        "&:hover::after": {
            opacity: 0.1
        },
        [`& .${rippleClass}`]: {
            backgroundColor: theme.lightFont
        }
    },
    image: {
        position: "absolute",
        inset: 0,
        minWidth: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center"
    },
    overlay: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.5,
        backgroundColor: theme.darkFont
    },
    content: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px",

        "& span": {
            fontWeight: "bold",
            color: theme.lightFont
        },
        "& .go": {
            alignSelf: "flex-end",
            zIndex: 100
        }
    },
}));

function GalleryLink() {
    const [rippleClass, rippleExpand, rippleFade] = useRippleEffect();
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState("");

    useEffect(() => {
        (async () => {
            setLoading(true);
            setImage(await import(`../images/backgrounds/custom.png`));
            setLoading(false);
        })();
    }, [])

    const router = useRouter();

    const theme = useTheme();
    const {cx, classes} = linkStyles({theme, rippleClass});
    return (loading?
        <CardSkeleton cx={cx} classes={classes} />
        :
        <div 
            className={classes.card}
            onMouseDown={rippleExpand} onMouseUp={rippleFade} 
            onClick={() => setTimeout(() => router.push(`/gallery`), 100)}
        >
            <Image class={classes.image} src={image} alt="" />
            <div className={classes.overlay} />
            <div className={classes.content}>
                <span>See other ideas we've brought to life!</span>
                <Icon className="go" role="secondary" appearance="outlined" button icon="arrow_forward" />
            </div>
        </div>
    );
}

const customsStyles = tss.create(({theme}) => ({
    customs: {
        position: "relative",
        width: "100%",
        maxWidth: "1500px",
        margin: "auto",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    cards: {
        width: "100%",
        alignSelf: "center",
        display: "flex",
        overflowX: "auto",
        gap: "10px",

        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
            display: "none"
        },
        "& *": {
            flex: "0 0 auto"
        }
    }
}));

export default function Customs({children}) {
    const theme = useTheme();
    const {classes} = customsStyles({theme});
    return (
        <section className={classes.customs}>
            <Heading>Customs Gallery</Heading>
            <div className={classes.cards}>
                {children}
                <GalleryLink />
            </div>
        </section>
    );
}