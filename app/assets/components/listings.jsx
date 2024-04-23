import {Suspense} from "react";
import Carousel from "./carousel";
import Card from "./card";
// import ProgressBar from "./progress-bar";
import useProgressBar from '../hooks/progress-bar.jsx';
import {GET_PRODUCTS} from "../../api";
import '../styles/components/listings.scss';

function ListingsPreloader() {
    return (
        <section className="preloader">
            <div className="progress">
                <i className="urban-icons">urbarch_logo</i>
                {/* <ProgressBar /> */}
            </div>
        </section>
    );
}

async function AsyncListings({searchParams}) {
    const queryStringList = []
    for(const [parameter, value] of Object.entries(searchParams))
        queryStringList.push(`${parameter}=${value.replace(/\|/g, "%7C")}`);
    const {progressBarFetch} = useProgressBar();
    const listings = await progressBarFetch(`${GET_PRODUCTS}?${queryStringList.join("&")}`, {cache: 'no-store'});
    return (
        <section className="listings">
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