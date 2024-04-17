import Database from "../../database";

export async function GET(request, {params: {id}}) {
    const result = await Database`
        WITH variations AS (
            SELECT extension, subname, price, overview, (
                SELECT json_agg(json_build_object(
                    'id', tag.id,
                    'name', tag.name,
                    'category_id', tag_categories.name,
                    'listing_id', product_variation__tag.listing_id
                )) FROM tag INNER JOIN tag_categories ON tag.category_id = tag_categories.id
                    INNER JOIN product_variation__tag ON product_variation__tag.tag_id = tag.id
                WHERE product_variation__tag.listing_id = ${id} AND product_variation__tag.variation_extension = extension
            ) AS tags 
            FROM product_variations WHERE listing_id = ${id} AND display = TRUE
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
    })
}