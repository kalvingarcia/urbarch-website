"use client"
import {useEffect, useState} from 'react';
import {Title} from "./typography";
import Card from './card';
import useWindowSize from '../hooks/window';
import "../styles/components/featured.scss";

export default function Featured({featured, changeWidth, home = false}) {
    const {width} = useWindowSize();
    const [view, setView] = useState(width <= changeWidth? "list" : "normal");
    useEffect(() => {
        if(width <= changeWidth && view === "normal")
            setView("list");
        else if(width > changeWidth && view === "list")
            setView("normal");
    }, [width]);

    return (
        <section className={["featured", home? "home" : ""].join(" ")}>
            <Title className="title">Featured Products</Title>
            <div className="divider" />
            <div className={["cards", width <= changeWidth? "column" : ""].join(" ")}>
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