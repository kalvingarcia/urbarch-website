import Database from "../../database";

export async function GET(request, {params: {id}}) {
    const result = await Database`
        WITH variations AS (
            SELECT extension, subname, description, (
                SELECT COALESCE(json_agg(json_build_object(
                    'id', finish.code,
                    'display', finish.name,
                    'value', variation_finish.price
                )), '[]') FROM finish INNER JOIN variation_finish ON variation_finish.finishCode = finish.code
                WHERE variation_finish.variationID = variation.id
            ) AS finishes, overview, (
                SELECT COALESCE(json_agg(json_build_object(
                    'id', tag.id,
                    'name', tag.name,
                    'category', tag.category
                )), '[]') FROM tag INNER JOIN variation_tag ON variation_tag.tagID = tag.id
                WHERE variation_tag.variationID = variation.id
            ) AS tags
            FROM variation WHERE variation.productID = ${id} AND variation.display = TRUE
        )
        SELECT id, name, description, (
            SELECT COALESCE(json_agg(json_build_object(
                'extension', variations.extension,
                'subname', variations.subname,
                'description', variations.description,
                'finishes', variations.finishes,
                'overview', variations.overview,
                'tags', variations.tags
            )), '[]') FROM variations
        ) AS variations
        FROM product WHERE product.id = ${id};
    `

    return new Response(JSON.stringify(result[0]), {
        "status": result.length === 0? 404 : 200
    });
}