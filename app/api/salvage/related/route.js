import Database from "../../database";

export async function GET(request) {
    const searchParameters = request.nextUrl.searchParams;

    const id = searchParameters.get("id");
    const serial = searchParameters.get("serial");

    const result = await Database`
        WITH product_tag_match AS (
            SELECT listing_id AS id, item_serial AS serial, tag_id
            FROM salvage_listing__tag
            WHERE tag_id IN (
                SELECT tag_id FROM salvage_listing__tag
                WHERE listing_id = ${id} AND item_serial = ${serial}
            )
        ), categories AS (
            /* Create a table with the tag name and listing id */
            SELECT DISTINCT listing_id AS id, tag.name AS category
            FROM tag INNER JOIN tag_categories ON tag.category_id = tag_categories.id  /* First we combine the tag and tag category information */
                INNER JOIN salvage_listing__tag ON salvage_listing__tag.tag_id = tag.id /* Then we combine the tags specific to the variations we have */
            WHERE tag_categories.name = 'Category' AND listing_id IN (SELECT id AS listing_id FROM product_tag_match)
        )
        SELECT DISTINCT id, name, category, COUNT(tag_id)
        FROM salvage_listing INNER JOIN product_tag_match USING(id) INNER JOIN categories USING(id)
        WHERE id != ${id} OR serial != ${serial}
        GROUP BY id, name, category
        HAVING COUNT(tag_id) > 5
        ORDER BY COUNT(tag_id) DESC LIMIT 10;
    `

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}