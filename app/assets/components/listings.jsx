import {Suspense} from "react";
import {GET_PRODUCTS} from "../../api";
import Carousel from "./carousel";
import Card from "./card";

function ListingsPreloader() {
    return (
        <section className="preloader">
            <i className="urban-icons">urbarch_logo</i>
        </section>
    );
}

async function AsyncListings({searchParams}) {
    const queryStringList = []
    for(const [parameter, value] of Object.entries(searchParams))
        queryStringList.push(`${parameter}=${value.replace(/\|/g, "%7C")}`);
    const listings = await fetch(`${GET_PRODUCTS}?${queryStringList.join("&")}`, {cache: 'no-store'}).then(response => response.json());
    return (
        <section>
            <Carousel>
                {listings.map(product => <Card key={product.id} type="list" id={product.id} name={product.name} category={product.category} price={product.price} />)}
            </Carousel>
        </section>
    );
}

export default function Listings({searchParams}) {
    return (
        <Suspense fallback={<ListingsPreloader />}>
            <AsyncListings searchParams={searchParams} />
        </Suspense>
    );
}