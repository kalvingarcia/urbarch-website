import Database from "../../database";

export async function GET(request) {
    const searchParameters = request.nextUrl.searchParams;

    const id = searchParameters.get("id");
    const extension = searchParameters.get("extension");

    const result = await Database`
        WITH custom_match AS (
            SELECT id FROM custom
            WHERE variationID = (SELECT id FROM variation WHERE productID = ${id} AND extension = ${extension} AND display = TRUE)
        ), categories AS (
            SELECT DISTINCT custom_tag.customID AS id, tag.category AS category
            FROM tag INNER JOIN custom_tag ON custom_tag.tagID = tag.id
            WHERE tag.category = 'Class' AND custom_tag.customID IN (SELECT id FROM custom_match)
        )
        SELECT DISTINCT custom.id, custom.name, categories.category, variation.productID, variation.extension AS variationExtension
        FROM custom INNER JOIN custom_match USING(id) INNER JOIN categories USING(id)
            INNER JOIN variation ON custom.variationID = variation.id;
    `

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}