import Database from "../../database";

export async function GET(request, {params}) {
    const {id} = await params;
    const result = await Database`
        WITH items AS (
            SELECT id, serial, subname, price, description, overview, (
                SELECT COALESCE(json_agg(json_build_object(
                    'id', tag.id,
                    'name', tag.name,
                    'category', tag.category
                )), '[]') FROM tag INNER JOIN item_tag ON item_tag.tagID = tag.id
                WHERE item_tag.itemID = item.id
            ) AS tags
            FROM item WHERE salvageID = ${id} AND display = TRUE
        )
        SELECT id, name, description, (
            SELECT COALESCE(json_agg(json_build_object(
                'serial', serial,
                'subname', subname,
                'price', price,
                'description', description,
                'overview', overview,
                'tags', tags
            )), '[]') FROM items
        ) AS items
        FROM salvage WHERE id = ${id};
    `

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}