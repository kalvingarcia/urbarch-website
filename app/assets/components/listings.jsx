"use client"
import {useSearchParams} from "next/navigation";
import {Suspense, useEffect, useState} from "react";
import Carousel from "./carousel";
import Card from "./card";
import ProgressBar from "./progress-bar";
import {GET_PRODUCTS} from "../../api";
import '../styles/components/listings.scss';

function ListingsPreloader() {
    return (
        <section className="preloader">
            <div className="progress">
                <i className="urban-icons">urbarch_logo</i>
                <ProgressBar />
            </div>
        </section>
    );
}

async function AsyncListings({queryString}) {
    const listings = await fetch(`${GET_PRODUCTS}?${queryString}`, {cache: "no-store"}).then(response => response.json());
    return (
        <Carousel>
            {listings.map(product => <Card key={product.id} type="list" id={product.id} name={product.name} category={product.category} price={product.price} />)}
        </Carousel>
    );
}

export default function Listings() {
    const searchParams = useSearchParams();
    const [queryString, setQueryString] = useState("");
    useEffect(() => {
        const queryStringList = []
        for(const [parameter, value] of searchParams.entries())
            queryStringList.push(`${parameter}=${value.replace(/\|/g, "%7C")}`);
        setQueryString(queryStringList.join("&"));
    }, [searchParams.entries()]);
    return (
        <Suspense fallback={<ListingsPreloader />}>
            <AsyncListings queryString={queryString} />
        </Suspense>
    );
}