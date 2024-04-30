import Database from "../../database";

export async function GET(request) {
    const searchParameters = request.nextUrl.searchParams;

    const id = searchParameters.get("id");
    const extension = searchParameters.get("extension");

    const result = await Database`
        WITH product_tag_match AS (
            SELECT listing_id AS id, variation_extension AS extension, tag_id
            FROM product_variation__tag
            WHERE tag_id IN (
                SELECT tag_id FROM product_variation__tag
                WHERE listing_id = ${id} AND variation_extension = ${extension}
            )
        ), categories AS (
            /* Create a table with the tag name and listing id */
            SELECT DISTINCT listing_id AS id, tag.name AS category
            FROM tag INNER JOIN tag_categories ON tag.category_id = tag_categories.id  /* First we combine the tag and tag category information */
                INNER JOIN product_variation__tag ON product_variation__tag.tag_id = tag.id /* Then we combine the tags specific to the variations we have */
            WHERE tag_categories.name = 'Class' AND listing_id IN (SELECT id AS listing_id FROM product_tag_match)
        )
        SELECT DISTINCT id, MIN(extension) AS extension, name, subname, category, COUNT(tag_id)
        FROM product_listing INNER JOIN product_variations ON product_listing.id = product_variations.listing_id 
            INNER JOIN product_tag_match USING(id, extension) INNER JOIN categories USING(id)
        WHERE id != ${id} OR extension != ${extension}
        GROUP BY id, name, subname, category
        HAVING COUNT(tag_id) > 5
        ORDER BY COUNT(tag_id) DESC LIMIT 20;
    `

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}