import Database from "../../database";

export async function GET(request, {params: {id}}) {
    const result = await Database`
        WITH variations AS (
            SELECT extension, subname, price, overview, (
                SELECT json_agg(json_build_object(
                    'id', tag.id,
                    'name', tag.name,
                    'category_id', tag_category.name,
                    'listing_id', product_variation__tag.listing_id
                )) FROM tag INNER JOIN tag_category ON tag.category_id = tag_category.id
                    INNER JOIN product_variation__tag ON product_variation__tag.tag_id = tag.id
                WHERE product_variation__tag.listing_id = '0' AND product_variation__tag.variation_extension = extension
            ) AS tags, (
                SELECT json_agg(json_build_object(
                    'id', product_listing.id,
                    'extension', product_variation.extension,
                    'name', product_listing.name,
                    'subname', product_variation.subname,
                    'price', product_variation.price
                )) FROM product_listing INNER JOIN product_variation ON product_listing.id = product_variation.listing_id
                WHERE (product_listing.id, product_variation.extension) IN (
                    SELECT id, extension
                    FROM json_populate_recordset('{"id": TEXT, "extension": TEXT}', overview->'replacement_ids')
                )
            ) AS replacements
            FROM product_variation WHERE listing_id = ${id} AND display = TRUE
        )
        SELECT id, name, description, (
            SELECT json_agg(json_build_object(
                'extension', extension,
                'subname', subname,
                'price', price,
                'overview', overview,
                'tags', tags
            )) FROM variations
        ) as variations
        FROM product_listing WHERE id = ${id};
    `

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}