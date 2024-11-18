import Database from "../../database";

export async function GET(request) {
    const searchParameters = request.nextUrl.searchParams;

    const id = searchParameters.get("id");
    const extension = searchParameters.get("extension");

    const result = await Database`
        WITH tag_match AS (
            SELECT variationID, tagID
            FROM variation_tag
            WHERE tagID IN (
                SELECT tagID 
                FROM variation_tag INNER JOIN variation ON variation.id = variation_tag.variationID
                WHERE variation.productID = ${id} AND variation.extension = ${extension}
            )
        ), categories AS (
            SELECT DISTINCT variationID, tag.name AS category
            FROM tag INNER JOIN variation_tag ON variation_tag.tagID = tag.id
                INNER JOIN variation ON variation_tag.variationID = variation.id
            WHERE tag.category = 'Class' AND variationID IN (SELECT variationID FROM tag_match)
        )
        SELECT DISTINCT product.id AS id, extension, name, subname, category, COUNT(tagID)
        FROM product INNER JOIN variation ON product.id = variation.productID
            INNER JOIN tag_match ON variation.id = tag_match.variationID
            INNER JOIN categories ON categories.variationID = variation.id
        WHERE product.id != ${id} AND extension != ${extension}
        GROUP BY product.id, extension, name, subname, category
        HAVING COUNT(tagID) > 0
        ORDER BY COUNT(tagID) DESC, product.id LIMIT 10;
    `

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}