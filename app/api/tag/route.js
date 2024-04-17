import Database from "../database";

export async function GET(request) {
    const categories = await Database`
        SELECT * FROM tag_categories;
    `
    const result = {}
    for(const category of categories) {
        const tags = await Database`
            SELECT * FROM tag
            WHERE category_id = ${category.id}
        `
        result[category.name] = tags
    }

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}