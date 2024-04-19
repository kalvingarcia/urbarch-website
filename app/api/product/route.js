import Database from "../database";

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
                WHERE tag_categories.name = 'Class' AND listing_id IN (SELECT listing_id FROM product_variations)
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
                filters[parameter].push(id);
            }
    
        result = await Database`
            WITH search_filtered AS (
                SELECT DISTINCT product_variations.listing_id AS id, product_variations.price AS price
                FROM product_listing INNER JOIN product_variations ON product_variations.listing_id = product_listing.id
                WHERE product_listing.index @@ plainto_tsquery('english', '${search}') OR product_variations.index @@ plainto_tsquery('english', '${search}')
                UNION
                SELECT DISTINCT product_variations.listing_id AS id, product_variations.price AS price
                FROM product_listing INNER JOIN product_variations ON product_variations.listing_id = product_listing.id
                WHERE product_listing.name LIKE '${search}%' OR product_variations.subname LIKE '${search}%'
            ), tag_filtered AS (
                ${Object.entries(filters).map(([_, value]) => {
                    return `
                        SELECT DISTINCT listing_id AS id FROM product_variation__tag WHERE tag_id = ANY ARRAY([${
                            value.map(id => `'${id}'::INT`).join(",")
                        }])
                    `
                }).join(" INTERSECT ")}
            ), categories AS (
                /* Create a table with the tag name and listing id */
                SELECT DISTINCT listing_id AS id, tag.name AS category
                FROM tag INNER JOIN tag_categories ON tag.category_id = tag_categories.id  /* First we combine the tag and tag category information */
                    INNER JOIN product_variation__tag ON product_variation__tag.tag_id = tag.id /* Then we combine the tags specific to the variations we have */
                WHERE tag_categories.name = 'Category' AND listing_id IN (SELECT listing_id FROM variations)
            )
            SELECT id, name, category, MIN(price) AS price
            FROM search_filtered INNER JOIN tag_filtered USING(id) INNER JOIN categories USING(id)
            GROUP BY id;
        `
    }

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}