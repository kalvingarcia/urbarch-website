"use client"
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
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

export default function Listings({from}) {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState([]);
    useEffect(() => {
        const queryStringList = []
        for(const [parameter, value] of searchParams.entries())
            queryStringList.push(`${parameter}=${value.replace(/\|/g, "%7C")}`);
        const queryString = queryStringList.join("&");

        (async () => {
            setLoading(true);
            setListings(await fetch(`${GET_PRODUCTS}?${queryString}`, {cache: "no-store"}).then(response => response.json()));
            setLoading(false);
        })();
    }, [searchParams.toString()]);

    return (loading?
        <ListingsPreloader />
        :
        <Carousel>
            {listings.map(product => (
                <Card
                    key={product.id}
                    type="list"
                    from={from}
                    id={product.id}
                    extension={product.extension}
                    name={product.name}
                    subname={product.subname}
                    category={product.category}
                    price={product.price}
                />
            ))}
        </Carousel>
    );
}