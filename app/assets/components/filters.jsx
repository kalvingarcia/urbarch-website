"use client"
import {useState, useContext, useEffect} from "react";
import {tss} from "tss-react";
import {useTheme} from "./theme";
import {QueryContext} from "./query-handler";
import {Title, Heading} from './typography';
import Button from './button';
import Icon from "./icon-comp";
import useRippleEffect from "../hooks/ripple";
import "../styles/components/filters.scss";
import {navigate} from "../auxillary/actions";

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

const filterStyles = tss.create(({theme}) => ({

}));

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

const filterGroupStyles = tss.create(({theme, open, rippleClass}) => ({
    group: {
        display: "flex",
        flexDirection: "column"
    },
    name: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        borderRadius: "2000px",
        overflow: "hidden",
        clipPath: "inset(0 0 0 0 round 2000px)",
        padding: "10px 20px",

        "&::after": {
            content: "''",
            position: "absolute",
            width: "100%",
            height: "100%",
            inset: 0,
            opacity: 0,
            transition: "background-color 300ms ease-in-out, opacity 300ms ease-in-out",
            backgroundColor: theme.onPrimary,
        },
        "&:hover::after": {
            opacity: 0.3
        },

        "& .expand": {
            transform: open? "rotate(-180deg)" : "none",
            transition: "transform 300ms ease-in-out, color 300ms ease-in-out"
        },

        [`& .${rippleClass}`]: {
            backgroundColor: theme.onPrimary
        }
    },
    drawer: {
        display: "flex",
        flexDirection: "column",
        maxHeight: open? "2000px" : 0,
        height: "fit-content",
        overflow: "hidden",
        transition: "max-height 300ms ease-in-out",
        marginLeft: "40px"
    },
}));

function FilterGroup({name, children}) {
    const [rippleClass, rippleExpand, rippleFade] = useRippleEffect();
    const [open, setOpen] = useState(false);

    const theme = useTheme();
    const {classes} = filterGroupStyles({theme, open, rippleClass});
    return (
        <div className={classes.group}>
            <div className={classes.name} onMouseDown={rippleExpand} onMouseUp={rippleFade} onClick={() => setOpen(!open)}>
                <Heading>{name}</Heading>
                <Icon className="expand" icon="arrow_drop_down" appearance="text" />
            </div>
            <div className={classes.drawer}>
                {children}
            </div>
        </div>
    );
}

const listStyles = tss.create({
    list: {
        display: "flex",
        flexDirection: "column",
        maxHeight: "100vh",
        overflowY: "auto"
    }
});

function FilterList({filters}) {
    const {classes} = listStyles();
    return (
        <div className={classes.list}>
            {filters.map(category => (
                category.tags?
                    category.category === "Class"?
                    <ChipGroup key={category.category}>
                        {category.tags.map(tag => <Chip key={tag.id} id={tag.id} name={tag.name} category={category.category} />)}
                    </ChipGroup>
                    :
                    <FilterGroup key={category.category} name={category.category}>
                        {category.tags.map(tag => <Filter key={tag.id} id={tag.id} name={tag.name} category={category.category} />)}
                    </FilterGroup>
                :
                ""
            ))}
        </div>
    );
}

const filtersStyles = tss.create(({theme, open}) => ({
    modalWrapper: {
        maxWidth: "fit-content",
        "@media (max-width: 1113px)": {
            display: "block",
            position: "fixed",
            zIndex: 1000,
        }
    },
    actionButton: {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        minWidth: "80px",
        minHeight: "80px",
        fontSize: "40px",

        "@media (min-width: 1113px)": {
            display: "none"
        }
    },
    scrim: {
        display: open? "block" : "none",
        position: "fixed",
        width: "100%",
        height: "100%",
        inset: 0,
        backgroundColor: theme.darkFont,
        opacity: 0.5,
        "@media (min-width: 1113px)": {
            display: "none"
        }
    },
    filters: {
        width: "500px",
        height: "fit-content",
        display: "flex",
        flexDirection: "column",
        padding: "40px",
        borderRadius: "20px",
        gap: "20px",
        backgroundColor: theme.primary,
        color: theme.onPrimary,

        "@media (max-width: 1300px)": {
            width: "400px"
        },
        "@media (max-width: 1113px)": {
            display: open? "flex" : "none",
            position: "fixed",
            width: "80%",
            heght: "80%",
            minHeight: "80%",
            top: "10%",
            left: "10%"
        }
    },
    titleBar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        "& .close": {
            "@media (min-width: 1113px)": {
                display: "none"
            }
        }
    },
    buttons: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        marginTop: "auto",
        gap: "20px"
    }
}));

export default function Filters({filters}) {
    const {applyRoute} = useContext(QueryContext);
    const [open, setOpen] = useState(false);

    const theme = useTheme();
    const {classes} = filtersStyles({theme, open});
    return (
        <div className={classes.modalWrapper}>
            <div className={classes.scrim}  onClick={() => setOpen(false)} />
            <section className={classes.filters}>
                <div className={classes.titleBar}>
                    <Title>Filters</Title>
                    <Icon className="close" role="primary" appearance="filled" button icon="close" onPress={() => setOpen(false)} />
                </div>
                <FilterList filters={filters} />
                <div className={classes.buttons}>
                    <Button role="secondary" style="tonal" onPress={() => navigate("/catalog")}>Clear</Button>
                    <Button role="primary" style="filled" onPress={() => applyRoute() || setOpen(false)}>Filter</Button>
                </div>
            </section>
            <Icon className={classes.actionButton} role="primary" appearance="filled" button onPress={() => setOpen(true)} icon="manage_search" />
        </div>
    );
}