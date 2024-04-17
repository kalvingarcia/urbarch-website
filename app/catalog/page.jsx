import Banner from "../assets/components/banner";
import {Display} from "../assets/components/typography";
import QueryHandler from "../assets/components/query-handler";
import Filters from "../assets/components/filters";
// import Search from "../assets/components/search";
import Listings from "../assets/components/listings";
import {GET_PRODUCTS, GET_TAGS} from "../api";

export default function Catalog({searchParams}) {
    const filters = fetch(GET_TAGS);
    // const listings = fetch(`${GET_PRODUCTS}?${searchParams.toString()}`);
    return (
        <main>
            <Banner src="catalog.jpg">
                <Display size="medium">Catalog</Display>
            </Banner>
            <QueryHandler>
                <div>
                    <Filters filterPromise={filters}/>
                    <div>
                        {/* <Search /> */}
                        {/* <Listings listingsPromise={listings} /> */}
                    </div>
                </div>
            </QueryHandler>
        </main>
    )
}