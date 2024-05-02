import Banner from "../assets/components/banner";
import {Display} from "../assets/components/typography";
import QueryHandler from "../assets/components/query-handler";
import Filters from "../assets/components/filters";
import Search from "../assets/components/search";
import Featured from "../assets/components/featured";
import Listings from "../assets/components/listings";
import "../assets/styles/pages/catalog.scss";
import {GET_FEATURED_PRODUCTS} from '../api';

export default async function Catalog({searchParams}) {
    const queryStringList = []
    for(const [parameter, value] of Object.entries(searchParams))
        queryStringList.push(`${parameter}=${value.replace(/\|/g, "%7C")}`);
    const queryString = queryStringList.join("&");
    const featured = await fetch(`${GET_FEATURED_PRODUCTS}?${queryString}`, {cache: 'no-store'}).then(response => response.json());
    return (
        <main>
            <Banner src="catalog.jpg">
                <Display size="medium">Catalog</Display>
            </Banner>
            <QueryHandler>
                <section className="catalog">
                    <Filters from="products" />
                    <div className="listings">
                        <Search />
                        {featured.length === 0? "" : <Featured featured={featured} changeWidth={1600} />}
                        <Listings from="products" />
                    </div>
                </section>
            </QueryHandler>
        </main>
    )
}