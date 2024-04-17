"use client"
import {useRouter, usePathname, useSearchParams} from 'next/navigation';
import {createContext, useCallback, useState, useEffect} from "react";

export const QueryContext = createContext();

export default function QueryHandler({children}) {
    const searchParameters = useSearchParams();
    const [queryParameters, setQueryParameter] = useState({search: "", filters: {}});
    useEffect(() => {
        for(const [parameter, value] of searchParameters.entries())
            if(parameter === "search")
                setSearch(value);
            else for(const id of value.replace("(", "").replace(")", "").split("|"))
                addFilter(parameter, id);
    }, []);

    const addFilter = useCallback((filterCategory, filterID) => {
        const {filters} = queryParameters;
        if(!filters.hasOwnProperty(filterCategory))
            filters[filterCategory] = []
        filters[filterCategory].push(filterID);
        setQueryParameter({...queryParameters, filters: filters});
    }, [queryParameters]);

    const removeFilter = useCallback((filterCategory, filterID) => {
        const {filters} = queryParameters;
        filters[filterCategory] = filters[filterCategory].filter(element => element !== filterID);
        if(filters[filterCategory].length === 0)
            delete filters[filterCategory];
        setQueryParameter({...queryParameters, filters: filters});
    }, [queryParameters]);

    const hasFilter = useCallback((filterCategory, filterID) => {
        const {filters} = queryParameters;
        return filters.hasOwnProperty(filterCategory) && filters[filterCategory].includes(filterID);
    }, [queryParameters]);

    const setSearch = useCallback(searchText => {
        setQueryParameter({...queryParameters, search: searchText})
    }, [queryParameters]);

    const pathname = usePathname();
    const router = useRouter();
    useEffect(() => {
        const queryStringList = [];
        if(queryParameters.hasOwnProperty("search") && queryParameters.search !== "")
            queryStringList.push(`search=${queryParameters.search}`)
        if(queryParameters.hasOwnProperty("filters") && Object.keys(queryParameters.filters).length !== 0)
            for(const [key, value] of Object.entries(queryParameters.filters))
                queryStringList.push(`${key}=${value}`);
        const queryString = queryStringList.join("&").replace("\"", "").replace("[", "(").replace("]", ")").replace(",", "+");
        if(queryString !== "")
            router.push(`${pathname}?${queryString}`);
    }, [queryParameters]);

    return (
        <QueryContext.Provider value={{addFilter, removeFilter, hasFilter, setSearch}} >
            {children}
        </QueryContext.Provider>
    );
}