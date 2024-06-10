import Database from "../database";

export async function GET(request) {
    const searchParameters = request.nextUrl.searchParams;
    const offset = searchParameters.offset? searchParameters.offset : 0;

    const result = await Database`
        SELECT id, name, description, customer, (
            SELECT json_build_object(
                'id', product_listing.id,
                'extension', product_variation.extension,
                'name', product_listing.name,
                'subname', product_variation.subname,
                'price', product_variation.price,
                'category', tag.name
            ) FROM product_listing INNER JOIN product_variation ON product_listing.id = product_variation.listing_id
                INNER JOIN product_variation__tag ON  product_listing.id = product_variation__tag.listing_id 
                    AND product_variation.extension = product_variation__tag.variation_extension
                INNER JOIN tag ON product_variation__tag.tag_id = tag.id
                INNER JOIN tag_category ON tag_category.id = tag.category_id
            WHERE product_listing.id = custom_item.listing_id AND product_variation.extension = custom_item.variation_extension
                AND tag_category.name = 'Class'
        ) AS product
        FROM custom_item
        WHERE display = TRUE
        LIMIT 30 OFFSET ${offset};
    `

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}