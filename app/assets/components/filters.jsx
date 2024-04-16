import {Suspense, use, useCallback} from "react";
import Button from "./button";

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

function FilterList({filterPromise}) {
    const filterList = use(filterPromise);
    const generateFilterGroups = useCallback(() => {
        const filterGroups = []
        for(const [category, tags] of Object.entries(filterList))
            filterGroups.push(
                <FilterGroup key={category} name={category}>
                    {tags.map(tag => <Filter key={tag.id} tagID={tag.id} name={tag.name} category={category} />)}
                </FilterGroup>
            )
        return filterGroups;
    }, []);
    return (
        <div>
            {generateFilterGroups()}
        </div>
    );
}

export default function Filters({filterPromise}) {
    return (
        <section>
            <div>
                <Suspense fallback={<FilterListSkeleton />}>
                    <FilterList filterPromise={filterPromise} />
                </Suspense>
            </div>
            <div>
                <Button role="primary" style="filled">Close</Button>
            </div>
        </section>
    );
}