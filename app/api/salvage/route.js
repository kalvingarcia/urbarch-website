import Database from "../database";
import {bton} from "../../assets/auxillary/helpers";

export async function GET(request) {
    const searchParameters = request.nextUrl.searchParams;

    var {search, filters} = {search: "", filters: {}};
    for(const [parameter, value] of searchParameters.entries())
        if(parameter === "search")
            search = value;
        else for(const id of value.split("|")) {
            if(!filters.hasOwnProperty(parameter))
                filters[parameter] = [];
            filters[parameter].push(bton(id));
        }

    const result = await Database`
        ${search != "" ?
            Database`
                WITH search_filtered AS (
                    SELECT DISTINCT salvage.id AS id, item.serial AS serial
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
                        SELECT DISTINCT item.salvageID AS id, item.serial AS serial
                        FROM item INNER JOIN item_tag ON item.id = item_tag.itemID
                        WHERE item_tag.tagID = ANY ARRAY[${value.map(id => `${id}`).join(",")}]
                    `)).join(" INTERSECT "))}
                ),
            `
            :
            Database``
        }
        ${search === "" && Object.entries(filters).length === 0? Database`WITH` : Database``} categories AS (
            SELECT DISTINCT item.salvageID AS id, item.serial AS serial, tag.name AS category
            FROM item INNER JOIN item_tag ON item_tag.itemID = item.id
                INNER JOIN tag ON item_tag.tagID = tag.id
            WHERE tag.category = 'Class'
        ), results AS (
            SELECT salvage.id AS id, item.serial AS serial, name, subname, category, price
            FROM salvage INNER JOIN item ON item.salvageID = salvage.id
                INNER JOIN categories ON salvage.id = categories.id AND item.serial = categories.serial
                ${search !== ""? Database`INNER JOIN search_filtered ON search_filtered.id = salvage.id AND search_filtered.serial = item.serial` : Database``}
                ${Object.entries(filters).length !== 0? Database`INNER JOIN tag_filtered ON tag_filtered.id = salvage.id AND tag_filtered.serial = item.serial` : Database``}
            WHERE item.display = TRUE
            GROUP BY salvage.id, item.serial, name, subname, category, price
        )
        SELECT DISTINCT id, serial, name, subname, category, price
        FROM results
        ORDER BY id;
    `

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}