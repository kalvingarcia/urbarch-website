import Database from "../../database";
import {bton} from "../../../assets/auxillary/helpers";

export async function GET(request) {
    const searchParameters = request.nextUrl.searchParams;
    var {search, from, filters} = {search: "", from: "", filters: {}};
    for(const [parameter, value] of searchParameters.entries())
        if(parameter === "search")
            search = value;
        else if(parameter === "from")
            from = value;
        else for(const id of value.split("|")) {
            if(!filters.hasOwnProperty(parameter))
                filters[parameter] = [];
            filters[parameter].push(bton(id));
        }
    
    const result = await Database`
        ${search !== ""?
            Database`
                WITH search_filtered AS (
                    SELECT item.id AS itemID
                    FROM salvage INNER JOIN item ON salvage.id = item.salvageID
                    WHERE salvage.index @@ to_tsquery(${search + ':*'}) OR item.index @@ to_tsquery(${search + ':*'})
                ),
            `
            :
            Database``
        }
        ${Object.entries(filters).length !== 0?
            Database`
                ${search === ""? Database`WITH` : Database``} tag_filtered AS (
                    ${Database.unsafe(Object.entries(filters).map(([_, value]) => (`
                        SELECT DISTINCT itemID
                        FROM item_tag
                        WHERE tagID IN (${value.map(id => `${id}`).join(", ")})
                    `)).join(" INTERSECT "))}
                ),
            `
            :
            Database``
        }
        ${search === "" && Object.entries(filters).length === 0? Database`WITH` : Database``} items AS (
            SELECT item.id AS itemID
            FROM item_tag INNER JOIN item ON item.id = item_tag.itemID
                ${search !== ""? Database`INNER JOIN search_filtered USING(itemID)` : Database``}
                ${Object.entries(filters).length !== 0? Database`INNER JOIN tag_filtered USING (itemID)` : Database``}
            WHERE display = TRUE
        )
        SELECT category, json_agg(json_build_object(
            'id', CAST(id AS TEXT),
            'name', name
        )) AS tags
        FROM tag
        WHERE id IN (
            SELECT DISTINCT tagID
            FROM item_tag
            WHERE itemID IN (SELECT itemID FROM items)
        ) OR category = 'Class' AND id IN (SELECT tagID FROM item_tag)
        GROUP BY category;
    `

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}