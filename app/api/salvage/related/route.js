import Database from "../../database";

export async function GET(request) {
    const searchParameters = request.nextUrl.searchParams;

    const id = searchParameters.get("id");
    const serial = searchParameters.get("serial");

    const result = await Database`
        WITH tag_match AS (
            SELECT itemID, tagID
            FROM item_tag
            WHERE tagID IN (
                SELECT tagID 
                FROM item_tag INNER JOIN item ON item.id = item_tag.itemID
                WHERE item.salvageID = ${id} AND item.serial = ${serial}
            )
        ), categories AS (
            SELECT DISTINCT itemID, tag.category AS category
            FROM tag INNER JOIN item_tag ON item_tag.tagID = tag.id
                INNER JOIN item ON item_tag.itemID = item.id
            WHERE tag.category = 'Class' AND itemID IN (SELECT itemID FROM tag_match)
        )
        SELECT DISTINCT salvage.id AS id, serial, name, subname, category, COUNT(tagID)
        FROM salvage INNER JOIN item ON salvage.id = item.salvageID
            INNER JOIN tag_match ON item.id = tag_match.itemID
            INNER JOIN categories ON categories.itemID = item.id
        WHERE salvage.id != ${id} AND serial != ${serial}
        GROUP BY salvage.id, serial, name, subname, category
        HAVING COUNT(tagID) > 0
        ORDER BY COUNT(tagID) DESC, salvage.id LIMIT 10;
    `

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}