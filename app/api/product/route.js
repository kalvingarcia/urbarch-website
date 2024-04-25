import Database from "../database";
import {bton} from "../../assets/auxillary/helpers";

export async function GET(request) {
    const searchParameters = request.nextUrl.searchParams;

    var result;
    if(searchParameters.size === 0) {
        result = await Database`
            WITH prices AS (
                SELECT DISTINCT listing_id as id, price AS price FROM product_variations
            ), categories AS (
                /* Create a table with the tag name and listing id */
                SELECT DISTINCT listing_id AS id, tag.name AS category
                FROM tag INNER JOIN tag_categories ON tag.category_id = tag_categories.id  /* First we combine the tag and tag category information */
                    INNER JOIN product_variation__tag ON product_variation__tag.tag_id = tag.id /* Then we combine the tags specific to the variations we have */
                WHERE tag_categories.name = 'Class' AND listing_id IN (SELECT id AS listing_id FROM prices)
            )
            SELECT id, name, category, MIN(price) AS price
            FROM product_listing INNER JOIN prices USING(id) INNER JOIN categories USING(id)
            GROUP BY id, category;
        `
    } else {
        var {search, filters} = {search: "", filters: {}};
        for(const [parameter, value] of searchParameters.entries())
            if(parameter === "search")
                search = value;
            else for(const id of value.split("|")) {
                if(!filters.hasOwnProperty(parameter))
                    filters[parameter] = [];
                filters[parameter].push(bton(id));
            }

        if(search !== "" && Object.entries(filters).length === 0)
            result = await Database`
                WITH search_filtered AS (
                    SELECT DISTINCT product_variations.listing_id AS id, product_listing.name as name, product_variations.price AS price
                    FROM product_listing INNER JOIN product_variations ON product_variations.listing_id = product_listing.id
                    WHERE product_listing.index @@ to_tsquery(${search + ':*'}) OR product_variations.index @@ to_tsquery(${search + ':*'})
                ), categories AS (
                    /* Create a table with the tag name and listing id */
                    SELECT DISTINCT listing_id AS id, tag.name AS category
                    FROM tag INNER JOIN tag_categories ON tag.category_id = tag_categories.id  /* First we combine the tag and tag category information */
                        INNER JOIN product_variation__tag ON product_variation__tag.tag_id = tag.id /* Then we combine the tags specific to the variations we have */
                    WHERE tag_categories.name = 'Class' AND listing_id IN (SELECT id FROM search_filtered)
                )
                SELECT id, name, category, MIN(price) AS price
                FROM search_filtered INNER JOIN categories USING(id)
                GROUP BY id, name, category;
            `
        else if(search === "" && Object.entries(filters).length !== 0)
            result = await Database`
                WITH tag_filtered AS (
                    ${Database.unsafe(Object.entries(filters).map(([_, value]) => (`
                        SELECT DISTINCT product_variation__tag.listing_id AS id, product_listing.name as name, product_variations.price AS price
                        FROM product_variation__tag INNER JOIN product_listing ON product_listing.id = product_variation__tag.listing_id
                            INNER JOIN product_variations ON product_variations.listing_id = product_listing.id
                        WHERE tag_id = ANY ARRAY[${value.map(id => `${id}`).join(",")}]
                    `)).join(" INTERSECT "))}
                ), categories AS (
                    /* Create a table with the tag name and listing id */
                    SELECT DISTINCT listing_id AS id, tag.name AS category
                    FROM tag INNER JOIN tag_categories ON tag.category_id = tag_categories.id  /* First we combine the tag and tag category information */
                        INNER JOIN product_variation__tag ON product_variation__tag.tag_id = tag.id /* Then we combine the tags specific to the variations we have */
                    WHERE tag_categories.name = 'Class' AND listing_id IN (SELECT listing_id FROM tag_filtered)
                )
                SELECT id, name, category, MIN(price) AS price
                FROM  tag_filtered INNER JOIN categories USING(id)
                GROUP BY id, name, category;
            `
        else 
            result = await Database`
                WITH search_filtered AS (
                    SELECT DISTINCT product_variations.listing_id AS id, product_listing.name as name, product_variations.price AS price
                    FROM product_listing INNER JOIN product_variations ON product_variations.listing_id = product_listing.id
                    WHERE product_listing.index @@ to_tsquery(${search + ':*'}) OR product_variations.index @@ to_tsquery(${search + ':*'})
                ), tag_filtered AS (
                    ${Database.unsafe(Object.entries(filters).map(([_, value]) => (`
                        SELECT DISTINCT product_variation__tag.listing_id AS id, product_listing.name as name, product_variations.price AS price
                        FROM product_variation__tag INNER JOIN product_listing ON product_listing.id = product_variation__tag.listing_id
                            INNER JOIN product_variations ON product_variations.listing_id = product_listing.id
                        WHERE tag_id = ANY ARRAY[${value.map(id => `${id}`).join(",")}]
                    `)).join(" INTERSECT "))}
                ), categories AS (
                    /* Create a table with the tag name and listing id */
                    SELECT DISTINCT listing_id AS id, tag.name AS category
                    FROM tag INNER JOIN tag_categories ON tag.category_id = tag_categories.id  /* First we combine the tag and tag category information */
                        INNER JOIN product_variation__tag ON product_variation__tag.tag_id = tag.id /* Then we combine the tags specific to the variations we have */
                    WHERE tag_categories.name = 'Class' AND listing_id IN (SELECT listing_id FROM tag_filtered)
                )
                SELECT id, name, category, MIN(price) AS price
                FROM search_filtered INNER JOIN tag_filtered USING(id, name, price) INNER JOIN categories USING(id)
                GROUP BY id, name, category;
            `
    }

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}