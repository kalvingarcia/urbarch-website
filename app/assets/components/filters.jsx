"use client"
import {useState, useContext, useEffect} from "react";
import {QueryContext} from "./query-handler";
import {Title, Heading} from './typography';
import Button from './button';
import IconButton from "./icon-button";
import useRippleEffect from "../hooks/ripple";
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

function Chip({id, name, category}) {
    const [rippleExpand, rippleFade] = useRippleEffect();
    const {hasFilter, addFilter, removeFilter} = useContext(QueryContext);
    const [on, setOn] = useState(hasFilter(category,id));
    useEffect(() => {
        if(on)
            addFilter(category, id);
        else
            removeFilter(category, id);
    }, [on]);

    return (
        <button className={["chip", on? "on" : ""].join(" ")} onMouseDown={rippleExpand} onMouseUp={rippleFade} onClick={() => setOn(!on)}>
            <i className={["urban-icons", "icon"].join(" ")}>{name.toLowerCase()}</i>
            <span className="label">{name}</span>
        </button>
    );
}

function ChipGroup({children}) {
    return (
        <div className="chip-group">
            {children}
        </div>
    );
}

function Filter({id, name, category}) {
    const {hasFilter, addFilter, removeFilter} = useContext(QueryContext);
    const [on, setOn] = useState(hasFilter(category,id));
    useEffect(() => {
        if(on)
            addFilter(category, id);
        else
            removeFilter(category, id);
    }, [on]);

    return (
        <div className="filter">
            <div className={["switch", on? "on" : ""].join(" ")} onClick={() => setOn(!on)}>
                <div className="slider" />
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

function FilterList({filters}) {
    return (
        <div className="filter-list">
            {filters.map(category => (
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

export default function Filters({filters}) {
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
                <FilterList filters={filters} />
                <div className="buttons">
                    <Button role="secondary" style="tonal">Clear</Button>
                    <Button role="primary" style="filled" onPress={() => applyRoute() || setOpen(false)}>Filter</Button>
                </div>
            </section>
            <IconButton className={["filter-button", open? "open" : ""].join(" ")} role="primary" style="filled" onPress={() => setOpen(true)} icon="manage_search" />
        </div>
    );
}