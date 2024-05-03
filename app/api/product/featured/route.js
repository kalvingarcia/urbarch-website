import Database from "../../database";
import {bton} from "@/app/assets/auxillary/helpers";

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
                    SELECT DISTINCT product_variations.listing_id AS id, product_variations.extension AS extension
                    FROM product_listing INNER JOIN product_variations ON product_variations.listing_id = product_listing.id
                    WHERE (product_listing.index @@ to_tsquery(${search + ':*'}) OR product_variations.index @@ to_tsquery(${search + ':*'}))
                ),
            `
            :
            Database``
        }
        ${Object.entries(filters).length !== 0?
            Database`
                ${search === ""? Database`WITH` : Database``} tag_filtered AS (
                    ${Database.unsafe(Object.entries(filters).map(([_, value]) => (`
                        SELECT DISTINCT product_variation__tag.listing_id AS id, product_variation__tag.variation_extension AS extension
                        FROM product_variation__tag
                        WHERE tag_id = ANY ARRAY[${value.map(id => `${id}`).join(",")}]
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
                INNER JOIN product_variation__tag ON product_variation__tag.tag_id = tag.id /* Then we combine the tags specific to the variations we have */
            WHERE tag_categories.name = 'Class'
        )
        SELECT DISTINCT id, extension, name, subname, category, price
        FROM product_listing INNER JOIN product_variations ON product_listing.id = product_variations.listing_id
            INNER JOIN categories USING(id)
            ${search !== ""? Database`INNER JOIN search_filtered USING(id, extension)` : Database``}
            ${Object.entries(filters).length !== 0? Database`INNER JOIN tag_filtered USING(id, extension)` : Database``}
        WHERE display = TRUE AND featured = TRUE LIMIT 3;
    `

    return new Response(JSON.stringify(result), {
        "status": 200
    })
}