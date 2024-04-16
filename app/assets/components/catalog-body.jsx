"use client"
import {useRouter, usePathname} from 'next/navigation';
import {createContext, useCallback, useState} from "react";
import Filters from "./filters";
import Listings from "./listings";
import {GET_TAGS} from "../../api";

export const QueryContext = createContext();

export default function CatalogBody({listingsPromise}) {
    const [queryParameters, setQueryParameter] = useState({search: {}, filters: {}});
    const addFilter = useCallback((filterCategory, filterID) => {
        const {filters} = queryParameters;
        if(!filters.hasOwnProperty(filterCategory))
            filters[filterCategory] = []
        filters[filterCategory].push(filterID);
        setQueryParameter({...queryParameters, filters: filters});
    }, [queryParameters]);
    const removeFilter = useCallback(filterID => {
        const {filters} = queryParameters;
        delete filters[filterID];
        setQueryParameter({...queryParameters, filters: filters});
    }, [queryParameters]);

    const setSearch = useCallback(searchText => {
        setQueryParameter({...queryParameters, search: searchText})
    }, [queryParameters]);

    const pathname = usePathname();
    const router = useRouter();
    useEffect(() => {
        const queryStringList = [];
        for(const [key, value] of Object.entries(queryParameters))
            queryStringList.push(`${key}=${value}`);
        const queryString = queryStringList.join("&").replace("\"", "").replace("[", "(").replace("]", ")").replace(",", "+");
        router.push(`${pathname}?${queryString}`);
    }, [queryParameters]);

    const filters = fetch(GET_TAGS);
    return (
        <QueryContext.Provider value={[addFilter, removeFilter]} >
            <div>
                <Filters filterPromise={filters}/>
                <div>
                    <Search onSearch={setSearch} />
                    <Listings listingsPromise={listingsPromise} />
                </div>
            </div>
        </QueryContext.Provider>
    );
}