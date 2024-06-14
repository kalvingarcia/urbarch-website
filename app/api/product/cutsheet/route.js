import Database from "../../database";
import {PDFDocument} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

let BASE_URL;
if(process.env.NODE_ENV === "development")
    BASE_URL = "http://localhost:3000";
else
    BASE_URL = "http://urbarch-website.kalvin.live";

export async function GET(request) {
    const searchParameters = request.nextUrl.searchParams;

    const id = searchParameters.get("id");
    const extension = searchParameters.get("extension");

    const productData = (await Database`
        WITH variations AS (
            SELECT listing_id AS id, extension, subname, price, overview, (
                SELECT json_build_object(
                    'id', tag.id,
                    'name', tag.name,
                    'category_id', tag_category.name,
                    'listing_id', product_variation__tag.listing_id
                ) FROM tag INNER JOIN tag_category ON tag.category_id = tag_category.id
                    INNER JOIN product_variation__tag ON product_variation__tag.tag_id = tag.id
                WHERE product_variation__tag.listing_id = ${id} AND product_variation__tag.variation_extension = extension
                    AND tag_category.name = 'Class'
            ) AS class, (
                SELECT json_build_object(
                    'id', tag.id,
                    'name', tag.name,
                    'category_id', tag_category.name,
                    'listing_id', product_variation__tag.listing_id
                ) FROM tag INNER JOIN tag_category ON tag.category_id = tag_category.id
                    INNER JOIN product_variation__tag ON product_variation__tag.tag_id = tag.id
                WHERE product_variation__tag.listing_id = ${id} AND product_variation__tag.variation_extension = extension
                    AND tag_category.name = 'Category'
            ) AS category, (
                SELECT DISTINCT COALESCE(json_agg(json_build_object(
                    'id', product_listing.id,
                    'extension', product_variation.extension,
                    'name', product_listing.name,
                    'subname', product_variation.subname,
                    'price', product_variation.price
                )), '[]') FROM json_to_recordset(overview->'replacements') AS replacements(id VARCHAR(10), extension VARCHAR(10))
                    INNER JOIN product_listing USING(id) 
                    INNER JOIN product_variation ON replacements.id = product_variation.listing_id AND product_variation.extension = replacements.extension
            ) AS replacements
            FROM product_variation WHERE listing_id = ${id} AND display = TRUE
        )
        SELECT id, extension, name, subname, description, price, overview, class, category, replacements
        FROM product_listing INNER JOIN variations USING(id)
        WHERE id = ${id} AND extension = ${extension};
    `)[0];

    const finishes = {
        "PB": "Polished Brass",
        "GP": "Green Patina",
        "BP": "Brown Patina",
        "AB": "Antique Brass",
        "STBL": "Statuary Black",
        "STBR": "Statuary Brown",
        "PN": "Polished Nickel",
        "SN": "Satin Nickel",
        "PC": "Polished Chrome",
        "LP": "Light Pewter",
        "BN": "Black Nickel"
    };
    let options = {
        finishes: {
            content: productData.overview.finishes.map(finish => ({...finish, display: finishes[finish.finish]})),
            link: false,
            link_name: ""
        },
        ...productData.overview.options
    };

    const serialized = {};
    options = Object.entries(options);
    for(const [name, value] of options) {
        const prices = {};
        for(const {difference, display} of value.content) {
            if(!prices[difference])
                prices[difference] = [];
            prices[difference].push(display);
        }

        serialized[name] = {
            link: value.link && value.link_name !== "finishes",
            prices: prices,
            deps: [],
        };
    }
    for(const [name, value] of options)
        if(value.link && value.link_name !== "finishes")
            serialized[value.link_name].deps.push(name);

    const currentDay = new Date();

    const pdf = await PDFDocument.create();
    pdf.setTitle(`${productData.name}${productData.subname !== "DEFAULT"? ` [${productData.subname}]` : ""} Cutsheet`);
    pdf.setAuthor('Kalvin Garcia');
    pdf.setCreator('Urban Archaeology');
    pdf.setCreationDate(currentDay);

    pdf.registerFontkit(fontkit);
    // add fonts using base64 converted font files

    // maybe do the same with the images
    let image = (await import(`../../../assets/images/products/${id}/${extension}/card.jpg`)).default;
    const thumbnail = await fetch(`${BASE_URL}${image.src}`).then(async response => pdf.embedJpg(await response.arrayBuffer()));
    // image = (await import(`../../../assets/images/products/${id}/${extension}/drawing.jpg`)).default;
    // const drawing  = await fetch(`${BASE_URL}${image.src}`).then(async response => pdf.embedJpg(await response.arrayBuffer()));

    const page = pdf.addPage();
    
    const thumbnailDimensions = thumbnail.scale(1);
    page.drawImage(thumbnail, {x: 300, y: 3000 - (900 / thumbnailDimensions.width) * thumbnailDimensions.height, width: 900, height: (900 / thumbnailDimensions.width) * thumbnailDimensions.height});

    page.drawText("Copyright © Urban Archaeology Ltd. All rights reserved.", {
        size: 30, x: (2550 - body.widthOfTextAtSize("Copyright © Urban Archaeology Ltd. All rights reserved.", 30)) / 2.0, y: 150, opacity: 0.75
    });
    const generatedOn = `Auto-generated on ${currentDay.toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})}.`;
    page.drawText(generatedOn, {
        size: 20, x: 2550 - body.widthOfTextAtSize(generatedOn, 20) - 20, y: 20, opacity: 0.5
    });

    const pdfDataURI = await pdf.saveAsBase64({dataUri: true});
    return new Response(pdfDataURI, {
        "status": 200
    });
}