"use client"
import {useEffect, useState} from 'react';
import {Title} from "./typography";
import Card, {CardSkeleton} from './card';
import useWindowSize from '../hooks/window';
import {GET_FEATURED_PRODUCTS} from '../../api';
import "../styles/components/featured.scss";

export default function Featured() {
    const [view, setView] = useState("normal");
    const {width} = useWindowSize();
    useEffect(() => {
        setView("normal");
        if(width < 1000)
            setView("list");
    }, [width]);

    const [loading, setLoading] = useState(true);
    const [featured, setFeatured] = useState([]);
    useEffect(() => {
        (async () => {
            setFeatured(await fetch(GET_FEATURED_PRODUCTS).then(response => response.json()));
            setLoading(false);
        })();
    }, []);

    return (
        <section className="featured">
            <Title className="title">Featured Products</Title>
            <div className="divider" />
            <div className="cards">
                {loading?
                    [<CardSkeleton type={view} />, <CardSkeleton type={view} />, <CardSkeleton type={view} />] : 
                    featured.map(data => (
                        <Card type={view} uaid={data.id} name={data.name} category={data.category} />
                    ))
                }
            </div>
        </section>
    );
}