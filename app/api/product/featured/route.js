import Database from "../../database";

export async function GET(request) {
    const result = await Database`
        WITH variations AS (
                /* Create a table with the price and listing id for the variation */
                SELECT listing_id, extension, subname, price FROM product_variations WHERE featured = TRUE
            ), categories AS (
                /* Create a table with the tag name and listing id */
                SELECT listing_id, tag.name AS category
                FROM tag INNER JOIN tag_categories ON tag.category_id = tag_categories.id  /* First we combine the tag and tag category information */
                    INNER JOIN product_variation__tag ON product_variation__tag.tag_id = tag.id /* Then we combine the tags specific to the variations we have */
                WHERE tag_categories.name = 'Class' AND listing_id IN (SELECT listing_id FROM variations)
            ), product AS (
                /* Create a table with the listing_id and name of the product */
                SELECT id AS listing_id, name FROM product_listing WHERE id IN (SELECT listing_id FROM variations)
            )
        /* Finally we select from these combined tables to get the information to display on the card */
        SELECT DISTINCT listing_id AS id, extension, name, subname, category, price
        FROM variations INNER JOIN categories USING(listing_id) INNER JOIN product USING(listing_id);
    `

    return new Response(JSON.stringify(result), {
        "status": 200
    })
}