import Banner from "../assets/components/banner";
import {Display} from "../assets/components/typography";
import QueryHandler from "../assets/components/query-handler";
import Filters from "../assets/components/filters";
import Search from "../assets/components/search";
import Listings from "../assets/components/listings";
import Card from "../assets/components/card";
import "../assets/styles/pages/catalog.scss";
import {GET_SALVAGE, GET_SALVAGE_TAGS} from '../api';

export default async function Salvage({searchParams}) {
    const queryStringList = []
    for(const [parameter, value] of Object.entries(await searchParams))
        queryStringList.push(`${parameter}=${value.replace(/\|/g, "%7C")}`);
    const queryString = queryStringList.join("&");

    const filters = await fetch(`${GET_SALVAGE_TAGS}?from=salvage&${queryString}`, {cache: 'no-store'}).then(response => response.json());
    const listings = await fetch(`${GET_SALVAGE}?${queryString}`, {cache: "no-store"}).then(response => response.json());
    return (
        <main>
            <Banner src="salvage.jpg">
                <Display size="medium">Salvage</Display>
            </Banner>
            <QueryHandler>
                <section className="catalog">
                    <Filters filters={filters} />
                    <div className="listings">
                        <Search />
                        <Listings>
                            {listings.map(salvage => (
                                <Card
                                    key={`${salvage.id}-${salvage.serial}`}
                                    type="list"
                                    from="salvage"
                                    id={salvage.id}
                                    extension={salvage.serial}
                                    name={salvage.name}
                                    subname={salvage.subname}
                                    category={salvage.category}
                                    price={salvage.price}
                                />
                            ))}
                        </Listings>
                    </div>
                </section>
            </QueryHandler>
        </main>
    )
}