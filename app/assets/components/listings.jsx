import {Suspense} from "react";
import {GET_PRODUCTS} from "../../api";

function ListingsPreloader() {
    return (
        <section>
            <div />
        </section>
    );
}

async function AsyncListings({searchParams}) {
    const listings = await fetch(`${GET_PRODUCTS}?${searchParams.toString()}`).then(response => response.json());
    return (
        <section>
            <div>
                {listings}
            </div>
            {/* <Pagination /> */}
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