import Database from "../../database";

export async function GET(request, {params: {id}}) {
    const result = await Database`
        WITH items AS (
            SELECT serial, price, overview, (
                SELECT json_agg(json_build_object(
                    'id', tag.id,
                    'name', tag.name,
                    'category_id', tag_category.name,
                    'listing_id', salvage_item__tag.listing_id
                )) FROM tag INNER JOIN tag_category ON tag.category_id = tag_category.id
                    INNER JOIN salvage_item__tag ON salvage_item__tag.tag_id = tag.id
                WHERE salvage_item__tag.listing_id = ${id} AND salvage_item__tag.item_serial = serial
            ) AS tags 
            FROM salvage_item WHERE listing_id = ${id} AND display = TRUE
        )
        SELECT id, name, description, (
            SELECT json_agg(json_build_object(
                'serial', serial,
                'price', price,
                'overview', overview,
                'tags', tags
            )) FROM items
        ) as items
        FROM salvage_listing WHERE id = ${id};
    `

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}