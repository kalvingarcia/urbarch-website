import Banner from "../assets/components/banner";
import {Display} from "../assets/components/typography";
import QueryHandler from "../assets/components/query-handler";
import Filters from "../assets/components/filters";
import Search from "../assets/components/search";
import Featured from "../assets/components/featured";
import Listings from "../assets/components/listings";
import Card from "../assets/components/card";
import "../assets/styles/pages/catalog.scss";
import {GET_FEATURED_PRODUCTS, GET_PRODUCTS, GET_PRODUCT_TAGS} from '../api';

export default async function Catalog({searchParams}) {
    const queryStringList = []
    for(const [parameter, value] of Object.entries(searchParams))
        queryStringList.push(`${parameter}=${value.replace(/\|/g, "%7C")}`);
    const queryString = queryStringList.join("&");

    const filters = await fetch(`${GET_PRODUCT_TAGS}?from=products&${queryString}`, {cache: 'no-store'}).then(response => response.json());
    const featured = await fetch(`${GET_FEATURED_PRODUCTS}?${queryString}`, {cache: 'no-store'}).then(response => response.json());
    const listings = await fetch(`${GET_PRODUCTS}?${queryString}`, {cache: "no-store"}).then(response => response.json());
    return (
        <main>
            <Banner src="catalog.jpg">
                <Display size="medium">Catalog</Display>
            </Banner>
            <QueryHandler>
                <section className="catalog">
                    <Filters filters={filters} />
                    <div className="listings">
                        <Search />
                        {featured.length === 0? "" : <Featured featured={featured} changeWidth={1600} />}
                        <Listings>
                            {listings.map(product => (
                                <Card
                                    key={`${product.id}${product.extension !== 'DEFAULT'? `-${product.extension}` : ""}`}
                                    type="list"
                                    from="products"
                                    id={product.id}
                                    extension={product.extension}
                                    name={product.name}
                                    subname={product.subname}
                                    category={product.category}
                                    price={product.price}
                                />
                            ))}
                        </Listings>
                    </div>
                </section>
            </QueryHandler>
        </main>
    )
}