"use client"
import {useEffect, useState} from 'react';
import {tss} from 'tss-react';
import {Title} from "./typography";
import Card from './card';
import useWindowSize from '../hooks/window';
import { useTheme } from './theme';

const useStyles = tss.create(({theme, view}) => ({
    featured: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",

        "&.home": {
            padding: "40px",
    
            "& $cards": {
                gap: "20px"
            }
        },
    },
    divider: {
        height: "1pt",
        width: "66%",
        maxWidth: "1000px",
        backgroundColor: theme.body,
        opacity: 0.5
    },
    cards: {
        width: "100%",
        display: "flex",
        flexDirection: view === "list"? "column" : "row",
        justifyContent: "center",
        gap: "10px"
    }
}));

export default function Featured({featured, changeWidth, home = false}) {
    const {width} = useWindowSize();
    const [view, setView] = useState(width <= changeWidth? "list" : "normal");
    useEffect(() => {
        if(width <= changeWidth && view === "normal")
            setView("list");
        else if(width > changeWidth && view === "list")
            setView("normal");
    }, [width]);

    const theme = useTheme();
    const {cx, classes} = useStyles({theme, view});
    return (
        <section className={cx(classes.featured, home? "home" : "")}>
            <Title>Featured Products</Title>
            <div className={classes.divider} />
            <div className={classes.cards}>
                {featured.map(data => (
                    <Card key={data.id}
                        from="products"
                        type={view}
                        id={data.id}
                        extension={data.extension}
                        name={data.name}
                        subname={data.subname}
                        category={data.category}
                        price={data.price}
                    />
                ))}
            </div>
        </section>
    );
}