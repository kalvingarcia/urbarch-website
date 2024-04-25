import Banner from "../assets/components/banner";
import {Display} from "../assets/components/typography";
import QueryHandler from "../assets/components/query-handler";
import Filters from "../assets/components/filters";
import Search from "../assets/components/search";
import Listings from "../assets/components/listings";
import "../assets/styles/pages/catalog.scss";

export default function Catalog() {
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
                        <Listings from="products" />
                    </div>
                </section>
            </QueryHandler>
        </main>
    )
}