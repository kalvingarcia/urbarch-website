import Banner from "../assets/components/banner";
import {Display} from "../assets/components/typography";
import QueryHandler from "../assets/components/query-handler";
import Filters from "../assets/components/filters";
// import Search from "../assets/components/search";
import Listings from "../assets/components/listings";

export default function Catalog({searchParams}) {
    return (
        <main>
            <Banner src="catalog.jpg">
                <Display size="medium">Catalog</Display>
            </Banner>
            <QueryHandler>
                <div>
                    <Filters />
                    <div>
                        {/* <Search /> */}
                        <Listings searchParams={searchParams} />
                    </div>
                </div>
            </QueryHandler>
        </main>
    )
}