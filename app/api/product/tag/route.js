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
                    SELECT DISTINCT product_variation.listing_id AS listing_id, product_variation.extension as variation_extension
                    FROM product_listing INNER JOIN product_variation ON product_variation.listing_id = product_listing.id
                    WHERE product_listing.index @@ to_tsquery(${search + ':*'}) OR product_variation.index @@ to_tsquery(${search + ':*'})
                ),
            `
            :
            Database``
        }
        ${Object.entries(filters).length !== 0?
            Database`
                ${search === ""? Database`WITH` : Database``} tag_filtered AS (
                    ${Database.unsafe(Object.entries(filters).map(([_, value]) => (`
                        SELECT DISTINCT listing_id, variation_extension
                        FROM product_variation__tag
                        WHERE tag_id IN (${value.map(id => `${id}`).join(", ")})
                    `)).join(" INTERSECT "))}
                ),
            `
            :
            Database``
        }
        ${search === "" && Object.entries(filters).length === 0? Database`WITH` : Database``} variations AS (
            SELECT DISTINCT listing_id, variation_extension
            FROM product_variation__tag
                ${search !== ""? Database`INNER JOIN search_filtered USING(listing_id, variation_extension)` : Database``}
                ${Object.entries(filters).length !== 0? Database`INNER JOIN tag_filtered USING(listing_id, variation_extension)` : Database``}
        )
        SELECT id, name, (
            SELECT json_agg(json_build_object(
                'id', CAST(tag.id AS TEXT),
                'name', tag.name,
                'category', tag_category.name
            )) FROM tag
            WHERE tag.category_id = tag_category.id AND (tag.id IN (
                SELECT DISTINCT tag_id 
                FROM product_variation__tag
                WHERE (listing_id, variation_extension) IN (SELECT listing_id, variation_extension FROM variations)
            ) OR tag_category.name = 'Class')
        ) AS tags
        FROM tag_category;
    `

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}