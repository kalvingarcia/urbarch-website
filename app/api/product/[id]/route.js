import Database from "../../database";

export async function GET(request, {params: {id}}) {
    const result = await Database`
        WITH variations AS (
            SELECT extension, subname, price, overview, (
                SELECT COALESCE(json_agg(json_build_object(
                    'id', tag.id,
                    'name', tag.name,
                    'category_id', tag_category.name,
                    'listing_id', product_variation__tag.listing_id
                )), '[]') FROM tag INNER JOIN tag_category ON tag.category_id = tag_category.id
                    INNER JOIN product_variation__tag ON product_variation__tag.tag_id = tag.id
                WHERE product_variation__tag.listing_id = ${id} AND product_variation__tag.variation_extension = extension
            ) AS tags, (
                SELECT DISTINCT COALESCE(json_agg(json_build_object(
                    'id', product_listing.id,
                    'extension', product_variation.extension,
                    'name', product_listing.name,
                    'subname', product_variation.subname,
                    'price', product_variation.price
                )), '[]') FROM json_to_recordset(overview->'replacements') AS replacements(id VARCHAR(10), extension VARCHAR(10))
                    INNER JOIN product_listing USING(id) 
                    INNER JOIN product_variation ON replacements.id = product_variation.listing_id AND product_variation.extension = replacements.extension
            ) AS replacements
            FROM product_variation WHERE listing_id = ${id} AND display = TRUE
        )
        SELECT id, name, description, (
            SELECT COALESCE(json_agg(json_build_object(
                'extension', extension,
                'subname', subname,
                'price', price,
                'overview', overview,
                'tags', tags,
                'replacements', replacements
            )), '[]') FROM variations
        ) as variations
        FROM product_listing WHERE id = ${id};
    `

    return new Response(JSON.stringify(result[0]), {
        "status": result.length === 0? 404 : 200
    });
}