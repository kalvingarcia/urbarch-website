import Database from "../database";
import {bton} from "../../assets/auxillary/helpers";

export async function GET(request) {
    const searchParameters = request.nextUrl.searchParams;

    var {alphaSort, search, filters} = {alphaSort: true, search: "", filters: {}};
    for(const [parameter, value] of searchParameters.entries())
        if(parameter === "alphaSort")
            alphaSort = value;
        else if(parameter === "search")
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
                    SELECT DISTINCT product.id AS id, variation.extension AS extension
                    FROM product INNER JOIN variation ON product.id = variation.productID
                    WHERE product.index @@ to_tsquery(${search + ':*'}) OR variation.index @@ to_tsquery(${search + ':*'})
                ),
            `
            :
            Database``
        }
        ${Object.entries(filters).length !== 0?
            Database`
                ${search === ""? Database`WITH` : Database``} tag_filtered AS (
                    ${Database.unsafe(Object.entries(filters).map(([_, value]) => (`
                        SELECT DISTINCT variation.productID AS id, variation.extension AS extension
                        FROM variation INNER JOIN variation_tag ON variation.id = variation_tag.variationID
                        WHERE variation_tag.tagID = ANY ARRAY[${value.map(id => `${id}`).join(",")}]
                    `)).join(" INTERSECT "))}
                ),
            `
            :
            Database``
        }
        ${search === "" && Object.entries(filters).length === 0? Database`WITH` : Database``} categories AS (
            SELECT DISTINCT variation.productID AS id, variation.extension AS extension, tag.name AS category
            FROM variation INNER JOIN variation_tag ON variation_tag.variationID = variation.id
                INNER JOIN tag ON variation_tag.tagID = tag.id
            WHERE tag.category = 'Class'
        ), results AS (
            SELECT product.id AS id, variation.extension AS extension, name, subname, category, MIN(variation_finish.price) AS starting, featured
            FROM product INNER JOIN variation ON variation.productID = product.id
                INNER JOIN categories ON product.id = categories.id AND variation.extension = categories.extension
                INNER JOIN variation_finish ON variation.id = variation_finish.variationID
                ${search !== ""? Database`INNER JOIN search_filtered ON search_filtered.id = product.id AND search_filtered.extension = variation.extension` : Database``}
                ${Object.entries(filters).length !== 0? Database`INNER JOIN tag_filtered ON tag_filtered.id = product.id AND tag_filtered.extension = variation.extension` : Database``}
            WHERE variation.display = TRUE
            GROUP BY product.id, variation.extension, name, subname, category, featured
            ORDER BY ${alphaSort? Database`name` : Database`starting`}
        )
        SELECT DISTINCT id, extension, name, subname, category, starting AS price
        FROM results
        WHERE (id, extension) NOT IN (SELECT id, extension FROM results WHERE featured = TRUE LIMIT 3)
        ORDER BY id;
    `

    return new Response(JSON.stringify(result), {
        "status": 200
    });
}