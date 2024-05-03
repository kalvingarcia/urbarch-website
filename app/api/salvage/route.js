import Database from "../database";
import {bton} from "../../assets/auxillary/helpers";

export async function GET(request) {
    const searchParameters = request.nextUrl.searchParams;

    var {search, filters} = {search: "", filters: {}};
    for(const [parameter, value] of searchParameters.entries())
        if(parameter === "search")
            search = value;
        else for(const id of value.split("|")) {
            if(!filters.hasOwnProperty(parameter))
                filters[parameter] = [];
            filters[parameter].push(bton(id));
        }

    const result = await Database`
        ${search !== ""?
            Database`
                WITH search_filtered AS (
                    SELECT DISTINCT id FROM salvage_listing WHERE index @@ to_tsquery(${search + ':*'})
                ),
            `
            :
            Database``
        }
        ${Object.entries(filters).length !== 0?
            Database`
                ${search === ""? Database`WITH` : Database``} tag_filtered AS (
                    ${Database.unsafe(Object.entries(filters).map(([_, value]) => (`
                        SELECT DISTINCT listing_id AS id FROM salvage_listing__tag WHERE tag_id = ANY ARRAY[${value.map(id => `${id}`).join(",")}]
                    `)).join(" INTERSECT "))}
                ),
            `
            :
            Database``
        }
        ${search === "" && Object.entries(filters).length === 0? Database`WITH` : Database``} categories AS (
            /* Create a table with the tag name and listing id */
            SELECT DISTINCT listing_id AS id, tag.name AS category
            FROM tag INNER JOIN tag_categories ON tag.category_id = tag_categories.id  /* First we combine the tag and tag category information */
                INNER JOIN salvage_listing__tag ON salvage_listing__tag.tag_id = tag.id /* Then we combine the tags specific to the variations we have */
            WHERE tag_categories.name = 'Class'
        )
        SELECT id, name, category
        FROM salvage_listing INNER JOIN categories USING(id)
            ${search !== ""? Database`INNER JOIN search_filtered USING(id)` : Database``}
            ${Object.entries(filters).length !== 0? Database`INNER JOIN tag_filtered USING(id)` : Database``}
        GROUP BY id, name, category
        HAVING COUNT((SELECT serial FROM salvage_items WHERE listing_id = id AND display = TRUE)) > 0;
    `

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}