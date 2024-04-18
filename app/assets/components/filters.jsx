"use client"
import {Suspense, useCallback, useState, useContext} from "react";
import {QueryContext} from "./query-handler";
import {Title} from './typography';
import Button from "./button";
import useRippleEffect from "../hooks/ripple";
import {GET_TAGS} from '../../api';

export function FilterListSkeleton() {
    return (
        <div>
            <div>
                <div />
                <div>
                    <div />
                    <div />
                    <div />
                </div>
            </div>
            <div />
            <div />
            <div />
        </div>
    );
}

function Filter({id, name, category}) {
    const {addFilter, removeFilter, hasFilter} = useContext(QueryContext);
    const [on, setOn] = useState(hasFilter(category, id));

    const toggleFilter = useCallback(() => {
        if(on)
            removeFilter(category, id);
        else
            addFilter(category, id);
        setOn(!on);
    }, [category, id]);

    return (
        <div>
            <div />
            <span>{name}</span>
        </div>
    );
}

function FilterGroup({name, children}) {
    const [rippleExpand, rippleFade] = useRippleEffect();
    const [open, setOpen] = useState(false);
    return (
        <div className="filter-group">
            <span className="name" onMouseDown={rippleExpand} onMouseUp={rippleFade} onClick={() => setOpen(!open)}>{name}</span>
            <div className={["drawer", open? "open" : ""].join()}>
                {children}
            </div>
        </div>
    );
}

async function FilterList() {
    const filterList = await fetch(GET_TAGS).then(response => response.json());
    const filterGroups = []
    for(const [category, tags] of Object.entries(filterList))
        filterGroups.push(
            <FilterGroup key={category} name={category}>
                {tags.map(tag => <Filter key={tag.id} id={tag.id} name={tag.name} category={category} />)}
            </FilterGroup>
        )
    return (
        <div>
            {filterGroups}
        </div>
    );
}

export default function Filters() {
    return (
        <section>
            <Title>Filters</Title>
            <div>
                <Suspense fallback={<FilterListSkeleton />}>
                    <FilterList />
                </Suspense>
            </div>
            <Button role="primary" style="filled">Close</Button>
        </section>
    );
}