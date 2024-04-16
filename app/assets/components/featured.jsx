"use client"
import {Suspense, useEffect, useState} from 'react';
import {Title} from "./typography";
import Card, {CardSkeleton} from './card';
import useWindowSize from '../hooks/window';
import {GET_FEATURED_PRODUCTS} from '../../api';
import "../styles/components/featured.scss";

export function FeaturedSkeleton({view}) {
    return (
        <section className="featured">
            <Title className="title">Featured Products</Title>
            <div className="divider" />
            <div className="cards">
                <CardSkeleton type={view} />
                <CardSkeleton type={view} />
                <CardSkeleton type={view} />
            </div>
        </section>
    );
}

async function AsyncFeatured({view}) {
    const featured = await fetch(GET_FEATURED_PRODUCTS).then(response => response.json());
    return (
        <section className="featured">
            <Title className="title">Featured Products</Title>
            <div className="divider" />
            <div className="cards">
                {featured.map(data => (
                    <Card key={data.id} type={view} uaid={data.id} name={data.name} category={data.category} price={data.price} />
                ))}
            </div>
        </section>
    );
}

export default function Featured() {
    const [view, setView] = useState("normal");
    const {width} = useWindowSize();
    useEffect(() => {
        if(width < 1000 && view === "normal")
            setView("list");
        else if(width >= 1000 && view === "list")
            setView("normal");
    }, [width]);

    return (
        <Suspense fallback={<FeaturedSkeleton view={view} />}>
            <AsyncFeatured view={view} />
        </Suspense>
    );
}