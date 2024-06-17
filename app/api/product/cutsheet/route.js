import Database from "../../database";
import {PDFDocument, rgb, breakTextIntoLines} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import pdfFonts from '../../../assets/fonts/pdf.json';

let BASE_URL;
if(process.env.NODE_ENV === "development")
    BASE_URL = "http://localhost:3000";
else
    BASE_URL = "http://urbarch-website.kalvin.live";

const pdfObject = await PDFDocument.create();
pdfObject.setAuthor('Kalvin Garcia');
pdfObject.setCreator('Urban Archaeology');

pdfObject.registerFontkit(fontkit);
const body = await pdfObject.embedFont(pdfFonts.universLight);
const emphasis = await pdfObject.embedFont(pdfFonts.universRoman);
const heading = await pdfObject.embedFont(pdfFonts.universBold);
const title = await pdfObject.embedFont(pdfFonts.universBlack);

const titleColor = rgb(0.066, 0.227, 0.329);
const subtitleColor = rgb(0.671, 0.561, 0.361);
const headingColor = rgb(0.475, 0.620, 0.702);
const subheadingColor = rgb(0.784, 0.678, 0.424);
const bodyColor = rgb(0.120, 0.118, 0.149);

const icons = await pdfObject.embedFont(pdfFonts.urbanIcons);
const urban = await pdfObject.embedFont(pdfFonts.universBold);
const archaeology = await pdfObject.embedFont(pdfFonts.trajan);

const pageObject = pdfObject.addPage();
pageObject.setSize(2550, 3300);

pageObject.setFontColor(bodyColor);
pageObject.setFont(body);

pageObject.drawText("urbarch_logo", {font: icons, size: 200, x: 150, y: 2950, color: titleColor, opacity: 0.1});
pageObject.drawText("urban", {font: urban, size: 60, x: 300, y: 3020, color: titleColor, opacity: 0.5});
pageObject.drawText("A R C H A E O L O G Y", {font: archaeology, size: 60, x: 480, y: 3020, color: titleColor, opacity: 0.5});

pageObject.drawText("Copyright © Urban Archaeology Ltd. All rights reserved.", {
    size: 30, x: (2550 - body.widthOfTextAtSize("Copyright © Urban Archaeology Ltd. All rights reserved.", 30)) / 2.0, y: 150, opacity: 0.75
});

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
                    'price', product_variation.price,
                    'overview', product_variation.overview
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

    const generatePDF = async (pdf, page) => {
        pdf.setTitle(`${productData.name}${productData.subname !== "DEFAULT"? ` [${productData.subname}]` : ""} Cutsheet`);

        const currentDay = new Date();
        pdf.setCreationDate(currentDay);
        const generatedOn = `Auto-generated on ${currentDay.toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})}.`;
        page.drawText(generatedOn, {
            size: 20, x: 2550 - body.widthOfTextAtSize(generatedOn, 20) - 40, y: 40, opacity: 0.5
        });
    
        page.drawText(productData.class.name.toLowerCase().replace(" ", "_"), {font: icons, size: 2000, x: 1000, y: -200, color: titleColor, opacity: 0.05});
        page.drawText(productData.category.name, {font: title, size: 50, x: 2550 - (title.widthOfTextAtSize(productData.category.name, 50) + 150), y: 3020, color: subtitleColor, opacity: 0.5});
    
        const columnWidth = 1050;

        let image = (await import(`../../../assets/images/products/${id}/${extension}/card.jpg`)).default;
        const thumbnail = await fetch(`${BASE_URL}${image.src}`).then(async response => pdf.embedJpg(await response.arrayBuffer()));
        // image = (await import(`../../../assets/images/products/${id}/${extension}/drawing.jpg`)).default;
        // const drawing  = await fetch(`${BASE_URL}${image.src}`).then(async response => pdf.embedJpg(await response.arrayBuffer()));
        const thumbnailDimensions = thumbnail.scale(1);
        page.drawImage(thumbnail, {
            x: 150, y: 2800 - (columnWidth / thumbnailDimensions.width) * thumbnailDimensions.height,
            width: columnWidth, height: (columnWidth / thumbnailDimensions.width) * thumbnailDimensions.height
        });

        page.drawText(productData.name, {font: title, size: 60, x: 1350, y: 2740, color: titleColor});
        let longTitle = false;
        if(productData.subname !== "DEFAULT") {
            longTitle = title.widthOfTextAtSize(productData.name, 60) + title.widthOfTextAtSize(productData.subname, 60) + 20 > 1350;
            page.drawText(productData.subname, {
                font: title, size: 60,
                x: 1350 + title.widthOfTextAtSize(productData.name, 60) + 20, y: 2740,
                color: subtitleColor
            });
        }
        page.drawText(
            `${productData.id}${productData.extension !== "DEFAULT"? `-${productData.extension}` : ""}`,
            {size: 40, x: 1350, y: longTitle? 2600 : 2680, opacity: 0.75}
        );
        page.drawText(
            `Starting at $${parseInt(productData.price).toLocaleString('en', {useGrouping: true})}`,
            {font: emphasis, size: 30, x: 1350, y: longTitle? 2520 : 2600}
        );

        const sectionGap = 40;
        const subtitleSize = 45;
        const subtitleGap = 20;
        const headingSize = 35;
        const headingGap = 15;
        const bodySize = 30;
        const bodyGap = 12;
        const tabSize = 30;

        const xPos = 1350;
        let yPos = 2500;

        if(productData.overview.finishes.length > 0) {
            const finishPrices = {};
            for(const {finish, difference} of productData.overview.finishes) {
                if(!finishPrices[difference])
                    finishPrices[difference] = [];
                finishPrices[difference].push(finishes[finish]);
            }

            yPos -= subtitleSize;
            page.drawText("Finishes", {font: title, size: subtitleSize, x: xPos, y: yPos, color: subtitleColor});
            yPos -= subtitleGap;
            const maxWidth = Math.max(...Object.entries(finishPrices).map(([difference]) => (
                emphasis.widthOfTextAtSize(`${Math.sign(difference) === -1? "-" : "+"}$${Math.abs(difference)} to starting price`, bodySize)
            )));
            for(const [difference, entries] of Object.entries(finishPrices)) {
                page.drawText(`${Math.sign(difference) === -1? "-" : "+"}$${Math.abs(difference)} to starting price`, {
                    font: emphasis, size: bodySize, x: xPos, y: yPos - bodySize
                });

                for(const line of breakTextIntoLines(entries.join(", "), [' '], columnWidth - (maxWidth + tabSize), word => body.widthOfTextAtSize(word, bodySize))) {
                    yPos -= bodySize;
                    page.drawText(line, {
                        size: bodySize, x: xPos + maxWidth + tabSize, y: yPos, maxWidth: columnWidth - (maxWidth + tabSize)
                    });
                    yPos -= bodyGap;
                }
                yPos -= bodyGap;
            }
            yPos -= sectionGap;
        }

        if(Object.entries(productData.overview.options).length > 0 && !Object.entries(productData.overview.options).every(([_, {link, link_name}]) => link && link_name !== "finishes")) {
            yPos -= subtitleSize;
            page.drawText("Options", {font: title, size: subtitleSize, x: xPos, y: yPos, color: subtitleColor});
            yPos -= subtitleGap;
            for(const [name, {link, link_name, content}] of Object.entries(productData.overview.options)) {
                if(!link || link_name === "finishes") {
                    yPos -= headingSize;
                    page.drawText(name, {font: heading, size: headingSize, x: xPos, y: yPos, color: headingColor});
                    page.drawText("(See replacements for detailed pricing.)", {
                        font: heading, size: bodySize,
                        x: xPos + heading.widthOfTextAtSize(name, headingSize) + tabSize, y: yPos + ((headingSize - bodySize) / 2),
                        color: headingColor, opacity: 0.5
                    });
                    yPos -= headingGap;

                    const options = new Set(content.map(({display}) => display.replace(/ \${([A-z\-\[\] ]+,?)+}/g, "")));
                    for(const line of breakTextIntoLines(Array.from(options).join(", "), [' '], columnWidth, word => body.widthOfTextAtSize(word, bodySize))) {
                        yPos -= bodySize;
                        page.drawText(line, {size: bodySize, x: xPos, y: yPos, maxWidth: columnWidth});
                        yPos -= bodyGap;
                    }
                    yPos -= bodyGap;
                }
            }
            yPos -= sectionGap;
        }
    
        if(productData.overview.bulb.quantity > 0) {
            yPos -= subtitleSize;
            page.drawText("Bulb Info", {font: title, size: subtitleSize, x: xPos, y: yPos, maxWidth: columnWidth, color: subtitleColor});
            yPos -= subtitleGap;
            const bulbInfo = `${productData.overview.bulb.shape.name} Bulb (${productData.overview.bulb.shape.code}) ${productData.overview.bulb.socket.name} Base (${productData.overview.bulb.socket.code})`;
            for(const line of [...breakTextIntoLines(bulbInfo, [' '], columnWidth, (word) => body.widthOfTextAtSize(word, bodySize)), `${productData.overview.bulb.specifications} recommended`, `(${productData.overview.bulb.quantity} count)`]) {
                yPos -= bodySize;
                page.drawText(line, {
                    size: bodySize,
                    x: xPos, y: yPos,
                    maxWidth: columnWidth
                });
                yPos -= bodyGap;
            }
            yPos -= sectionGap;
        }

        if(productData.overview.ul.length > 0 && productData.overview.ul[0] !== "None") {
            yPos -= subtitleSize;
            page.drawText("UL Listing", {font: title, size: subtitleSize, x: xPos, y: yPos, maxWidth: columnWidth, color: subtitleColor});
            yPos -= subtitleGap;
            yPos -= bodySize;
            page.drawText(`This product is listed for use in ${productData.overview.ul[0].toUpperCase()} environments.`, {size: bodySize, x: xPos, y: yPos});
            yPos -= bodyGap;
            yPos -= sectionGap;
        }
    
        if(productData.replacements.length > 0) {
            yPos -= subtitleSize;
            page.drawText("Replacements", {font: title, size: subtitleSize, x: xPos, y: yPos, maxWidth: columnWidth, color: subtitleColor});
            yPos -= subtitleGap;

            let column0MaxWidth = 0, column1MaxWidth = 0;
            productData.replacements.forEach(replacement => {
                let check = 0;

                check = body.widthOfTextAtSize(`$${replacement.price}`, bodySize);
                column0MaxWidth = check > column0MaxWidth? check : column0MaxWidth;

                check = body.widthOfTextAtSize(`${replacement.name}${replacement.subname !== "DEFAULT"? ` [${replacement.subname}]` : ""}`, bodySize);
                column1MaxWidth = check > column1MaxWidth? check : column1MaxWidth;
            })
            for(const replacement of productData.replacements) {
                yPos -= bodySize;
                page.drawText(`$${replacement.price}`, {size: bodySize, x: xPos, y: yPos});
                page.drawText(`${replacement.name}${replacement.subname !== "DEFAULT"? ` [${replacement.subname}]` : ""}`, {
                    size: bodySize, x: xPos + column0MaxWidth + tabSize, y: yPos
                });
                page.drawText(`${replacement.id}${replacement.extension !== "DEFAULT"? `-${replacement.extension}` : ""}`, {
                    size: bodySize, x: xPos + column0MaxWidth + column1MaxWidth + tabSize * 2, y: yPos
                });
                yPos -= bodyGap;

                const optionsSize = bodySize * 0.8;
                const optionsGap = bodyGap * 0.8;
                if(replacement.overview.finishes.length > 0) {
                    const finishPrices = {};
                    for(const {finish, difference} of replacement.overview.finishes) {
                        if(!finishPrices[difference])
                            finishPrices[difference] = [];
                        finishPrices[difference].push(finishes[finish]);
                    }

                    yPos -= optionsSize;
                    page.drawText("Finishes", {font: emphasis, size: optionsSize, x: xPos + tabSize, y: yPos});
                    yPos -= optionsGap;

                    let priceGroup = 1;
                    const maxWidth = Math.max(...Object.keys(finishPrices).map(difference => body.widthOfTextAtSize(`${Math.sign(difference) === -1? "-" : "+"}$${Math.abs(difference)}`, optionsSize)));
                    for(const difference of Object.keys(finishPrices)) {
                        yPos -= optionsSize;
                        page.drawText(`${Math.sign(difference) === -1? "-" : "+"}$${Math.abs(difference)}`, {size: optionsSize, x: xPos + tabSize * 2, y: yPos});
                        page.drawText(`Price Group ${priceGroup++}`, {size: optionsSize, x: xPos + tabSize * 3 + maxWidth, y: yPos});
                        yPos -= optionsGap;
                    }
                    yPos -= optionsGap;
                }
            }
            yPos -= sectionGap;
        }

        if(productData.overview.notes !== "") {
            yPos -= subtitleSize;
            page.drawText("Notes", {font: title, size: subtitleSize, x: xPos, y: yPos, maxWidth: columnWidth, color: subtitleColor});
            yPos -= subtitleGap;
            yPos -= bodySize;
            page.drawText(productData.overview.notes, {size: bodySize, x: xPos, y: yPos});
            yPos -= bodyGap;
            yPos -= sectionGap;
        }

        return await pdf.saveAsBase64({dataUri: true});
    }

    return new Response(await generatePDF(pdfObject, pageObject), {
        "status": 200
    });
}