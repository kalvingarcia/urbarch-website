import Database from "../../database";

export async function GET(request, {params: {id}}) {
    const result = await Database`
        WITH items AS (
            SELECT serial, price, overview, (
                SELECT json_agg(json_build_object(
                    'id', tag.id,
                    'name', tag.name,
                    'category_id', tag_categories.name,
                    'listing_id', salvage_listing__tag.listing_id
                )) FROM tag INNER JOIN tag_categories ON tag.category_id = tag_categories.id
                    INNER JOIN salvage_listing__tag ON salvage_listing__tag.tag_id = tag.id
                WHERE salvage_listing__tag.listing_id = ${id} AND salvage_listing__tag.item_serial = serial
            ) AS tags 
            FROM salvage_items WHERE listing_id = ${id} AND display = TRUE
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