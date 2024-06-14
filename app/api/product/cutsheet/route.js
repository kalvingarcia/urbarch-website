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

    const pdf = await PDFDocument.create();
    pdf.setTitle(`${productData.name}${productData.subname !== "DEFAULT"? ` [${productData.subname}]` : ""}`);
    pdf.setAuthor('Kalvin Garcia');
    pdf.setCreator('Urban Archaeology');
    pdf.setCreationDate(new Date());

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

    page.setSize(2550, 3300);
    page.setFont(cinzel);
    page.setFontSize(80);
    page.drawText(`${productData.name}${productData.subname !== "DEFAULT"? ` [${productData.subname}]` : ""}`, {font: openSansBold, x: 1350, y: 3000});
    page.setFont(openSansLight);
    page.setFontSize(40);
    page.drawText(`${productData.id}${productData.extension !== "DEFAULT"? `-${productData.extension}` : ""}`, {x: 1350, y: 2940});
    page.setFont(openSansMedium);
    page.setFontSize(60);
    page.drawText(`$${parseInt(productData.price).toLocaleString('en', {useGrouping: true})}.00`, {x: 1350, y: 2840});

    const pdfDataURI = await pdf.saveAsBase64({dataUri: true});
    return new Response(pdfDataURI, {
        "status": 200
    });
}