"use client"
import {useRouter, usePathname, useSearchParams} from 'next/navigation';
import {createContext, useCallback, useState, useEffect} from "react";
import {ntob, bton} from '../auxillary/helpers';

export const QueryContext = createContext();

export default function QueryHandler({children}) {
    const searchParameters = useSearchParams();
    const [queryParameters, setQueryParameter] = useState(() => {
        var {search, filters} = {search: "", filters: {}};
        for(const [parameter, value] of searchParameters.entries())
            if(parameter === "search")
                search = value;
            else for(const id of value.split("|")) {
                if(!filters.hasOwnProperty(parameter))
                    filters[parameter] = new Set();
                filters[parameter].add(bton(id));
            }
        return {search, filters};
    });

    const pathname = usePathname();
    const router = useRouter();
    const applyRoute = useCallback(() => {
        const queryStringList = [];
        if(queryParameters.hasOwnProperty("search") && queryParameters.search !== "")
            queryStringList.push(`search=${queryParameters.search}`)
        if(queryParameters.hasOwnProperty("filters") && Object.keys(queryParameters.filters).length !== 0)
            for(const [key, value] of Object.entries(queryParameters.filters))
                queryStringList.push(`${key}=${Array.from(value).map(id => ntob(id)).join("%7C")}`);

        const queryString = queryStringList.join("&");
        router.push(`${pathname}?${queryString}`);
    }, [pathname, router, queryParameters]);

    const getSearch = useCallback(() => {
        return queryParameters.search;
    }, [queryParameters])

    const setSearch = useCallback(searchText => {
        setQueryParameter({...queryParameters, search: searchText});
    }, [queryParameters]);

    const hasFilter = useCallback((filterCategory, filterID) => {
        const {filters} = queryParameters;
        return filters.hasOwnProperty(filterCategory) && filters[filterCategory].has(filterID);
    }, [queryParameters]);

    const addFilter = useCallback((filterCategory, filterID) => {
        const {filters} = queryParameters;
        if(!filters.hasOwnProperty(filterCategory))
            filters[filterCategory] = new Set();
        filters[filterCategory].add(filterID);
        setQueryParameter({...queryParameters, filters: filters});
    }, [queryParameters]);

    const removeFilter = useCallback((filterCategory, filterID) => {
        const {filters} = queryParameters;
        if(filters.hasOwnProperty(filterCategory)) {
            filters[filterCategory].delete(filterID);
            if(filters[filterCategory].size === 0)
                delete filters[filterCategory];
        }
        setQueryParameter({...queryParameters, filters: filters});
    }, [queryParameters]);

    return (
        <QueryContext.Provider value={{getSearch, setSearch, hasFilter, addFilter, removeFilter, applyRoute}} >
            {children}
        </QueryContext.Provider>
    );
}