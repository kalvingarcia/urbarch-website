import Database from "../database";

export async function GET(request) {
    const searchParameters = request.nextUrl.searchParams;

    var searchText;
    const filters = {};
    for(const [parameter, value] of searchParameters.entries())
            if(parameter === "search")
                searchText = value;
            else for(const id of value.replace("(", "").replace(")", "").split("|")) {
                if(!filters.hasOwnProperty(parameter))
                    filters[parameter] = [];
                filters[parameter].push(id);
            }

    const result = await Database`
        SELECT * FROM product_listing;
    `

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}