import Database from "../../database";

export async function GET(request) {
    const searchParameters = request.nextUrl.searchParams;

    const id = searchParameters.get("id");
    const extension = searchParameters.get("extension");

    const result = await Database`
        WITH product_custom_match AS (
            SELECT id FROM custom_item
            WHERE listing_id = ${id} AND variation_extension = ${extension} AND display = TRUE
        ), categories AS (
            /* Create a table with the tag name and listing id */
            SELECT DISTINCT item_id AS id, tag.name AS category
            FROM tag INNER JOIN tag_category ON tag.category_id = tag_category.id  /* First we combine the tag and tag category information */
                INNER JOIN custom_item__tag ON custom_item__tag.tag_id = tag.id /* Then we combine the tags specific to the variations we have */
            WHERE tag_category.name = 'Class' AND item_id IN (SELECT id FROM product_custom_match)
        )
        SELECT DISTINCT id, name, customer, category, listing_id, variation_extension
        FROM custom_item INNER JOIN product_custom_match USING(id) INNER JOIN categories USING(id);
    `

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}