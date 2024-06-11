import Database from "../../database";
import {bton} from "../../../assets/auxillary/helpers";

export async function GET(request) {
    const searchParameters = request.nextUrl.searchParams;
    var {search, from, filters} = {search: "", from: "", filters: {}};
    for(const [parameter, value] of searchParameters.entries())
        if(parameter === "search")
            search = value;
        else if(parameter === "from")
            from = value;
        else for(const id of value.split("|")) {
            if(!filters.hasOwnProperty(parameter))
                filters[parameter] = [];
            filters[parameter].push(bton(id));
        }
    
    const result = await Database`
        ${search !== ""? 
            Database`
                WITH search_filtered AS (
                    SELECT DISTINCT id AS listing_id FROM salvage_listing WHERE index @@ to_tsquery(${search + ':*'})
                ),
            `
            :
            Database``
        }
        ${Object.entries(filters).length !== 0?
            Database`
                ${search === ""? Database`WITH` : Database``} tag_filtered AS (
                    ${Database.unsafe(Object.entries(filters).map(([_, value]) => (`
                        SELECT DISTINCT listing_id FROM salvage_item__tag WHERE tag_id = ANY ARRAY[${value.map(id => `${id}`).join(",")}]
                    `)).join(" INTERSECT "))}
                ),
            `
            :
            Database``
        }
        ${search === "" && Object.entries(filters).length === 0? Database`WITH` : Database``} listings AS (
            SELECT DISTINCT listing_id
            FROM salvage_item__tag
                ${search !== ""? Database`INNER JOIN search_filtered USING(listing_id)` : Database``}
                ${Object.entries(filters).length !== 0? Database`INNER JOIN tag_filtered USING(listing_id)` : Database``}
        )
        SELECT id, name, (
            SELECT json_agg(json_build_object(
                'id', CAST(tag.id AS TEXT),
                'name', tag.name,
                'category', tag_category.name
            )) FROM tag
            WHERE tag.category_id = tag_category.id AND (tag.id IN (
                SELECT DISTINCT tag_id 
                FROM salvage_item__tag
                WHERE listing_id IN (SELECT listing_id FROM listings)
            ) OR tag_category.name = 'Class' AND tag.id IN (SELECT tag_id FROM salvage_item__tag))
        ) AS tags
        FROM tag_category;
    `

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}