"use client"
import {Suspense, useState, useContext, useEffect, memo} from "react";
import {QueryContext} from "./query-handler";
import {Title, Heading} from './typography';
import Button from './button';
import IconButton from "./icon-button";
import useRippleEffect from "../hooks/ripple";
import {GET_TAGS} from '../../api';
import "../styles/components/filters.scss";

export function FilterListSkeleton() {
    return (
        <div className="filter-list skeleton">
            <div className="filter-group">
                <div className="name ">
                    <div className="label" />
                    <i className="material-icons">arrow_drop_down</i>
                </div>
                <div className="drawer open">
                    <div className="filter">
                        <div className="switch" />
                        <div className="label" />
                    </div>
                    <div className="filter">
                        <div className="switch" />
                        <div className="label" />
                    </div>
                </div>
            </div>
            <div className="filter-group">
                <div className="name ">
                    <div className="label" />
                    <i className="material-icons">arrow_drop_down</i>
                </div>
            </div>
            <div className="filter-group">
                <div className="name ">
                    <div className="label" />
                    <i className="material-icons">arrow_drop_down</i>
                </div>
            </div>
            <div className="filter-group">
                <div className="name ">
                    <div className="label" />
                    <i className="material-icons">arrow_drop_down</i>
                </div>
            </div>
            <div className="filter-group">
                <div className="name ">
                    <div className="label" />
                    <i className="material-icons">arrow_drop_down</i>
                </div>
            </div>
            <div className="filter-group">
                <div className="name ">
                    <div className="label" />
                    <i className="material-icons">arrow_drop_down</i>
                </div>
            </div>
        </div>
    );
}

function Filter({id, name, category}) {
    const {addFilter, removeFilter, hasFilter, requestEvent, clearEvent} = useContext(QueryContext);
    const [on, setOn] = useState(hasFilter(category, id));

    useEffect(() => {
        if(on)
            addFilter(category, id);
        else
            removeFilter(category, id);
    }, [requestEvent])

    useEffect(() => {
        if(on) {
            removeFilter(category, id);
            setOn(false);
        }
    }, [clearEvent]);

    return (
        <div className="filter">
            <div className={["switch", on? "on" : ""].join(" ")} onClick={() => setOn(!on)}>
                <div className="slider"/>
            </div>
            <span className="label">{name}</span>
        </div>
    );
}

function FilterGroup({name, children}) {
    const [rippleExpand, rippleFade] = useRippleEffect();
    const [open, setOpen] = useState(false);
    return (
        <div className="filter-group">
            <div className="name" onMouseDown={rippleExpand} onMouseUp={rippleFade} onClick={() => setOpen(!open)}>
                <Heading className="label">{name}</Heading>
                <i className={["material-icons", "expand", open? "open" : ""].join(" ")}>arrow_drop_down</i>
            </div>
            <div className={["drawer", open? "open" : ""].join(" ")}>
                {children}
            </div>
        </div>
    );
}

function FilterList() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [filterList, setFilterList] = useState([]);
    useEffect(() => {
        const queryStringList = []
        for(const [parameter, value] of searchParams.entries())
            queryStringList.push(`${parameter}=${value.replace(/\|/g, "%7C")}`);
        const queryString = queryStringList.join("&");

        (async () => {
            setLoading(true);
            setFilterList(await fetch(`${GET_TAGS}?${queryString}`).then(response => response.json()));
            setLoading(false);
        })();
    }, [searchParams.toString()]);

    return (loading?
        <FilterListSkeleton />
        :
        <div className="filter-list">
            {filterList.map(category => (
                category.tags?
                    category.name === "Class"?
                    <ChipGroup key={category.id}>
                        {category.tags.map(tag => <Chip key={tag.id} id={tag.id} name={tag.name} category={tag.category} />)}
                    </ChipGroup>
                    :
                    <FilterGroup key={category.id} name={category.name}>
                        {category.tags.map(tag => <Filter key={tag.id} id={tag.id} name={tag.name} category={tag.category} />)}
                    </FilterGroup>
                :
                ""
            ))}
        </div>
    );
}

export default function Filters() {
    const {applyRoute} = useContext(QueryContext);
    const [open, setOpen] = useState(false);

    return (
        <div className={["filter-modal-wrapper", open? "open" : ""].join(" ")}>
            <div className="scrim"  onClick={() => setOpen(false)} />
            <section className="filters">
                <div className="title-bar">
                    <Title>Filters</Title>
                    <IconButton className="close" role="primary" style="filled" icon="close" onPress={() => setOpen(false)}/>
                </div>
                <FilterList />
                <div className="buttons">
                    <Button role="secondary" style="tonal">Clear</Button>
                    <Button role="primary" style="filled" onPress={() => applyRoute() || setOpen(false)}>Filter</Button>
                </div>
            </section>
            <IconButton className={["filter-button", open? "open" : ""].join(" ")} role="primary" style="filled" onPress={() => setOpen(true)} icon="manage_search" />
        </div>
    );
}