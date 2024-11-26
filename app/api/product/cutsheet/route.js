import Database from "../../database";
import {PDFDocument, rgb, breakTextIntoLines} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import pdfFonts from '../../../assets/fonts/pdf.json';

let BASE_URL;
if(process.env.NODE_ENV === "development")
    BASE_URL = "http://localhost:3000";
else
    BASE_URL = "http://urbarch-website.kalvin.live";

export async function GET(request) {
    try {
        const searchParameters = request.nextUrl.searchParams;

        const id = searchParameters.get("id");
        const extension = searchParameters.get("extension");

        const pdf = await PDFDocument.create();
        pdf.setAuthor('Kalvin Garcia');
        pdf.setCreator('Urban Archaeology');

        pdf.registerFontkit(fontkit);
        const body = await pdf.embedFont(pdfFonts.universLight);
        const emphasis = await pdf.embedFont(pdfFonts.universRoman);
        const heading = await pdf.embedFont(pdfFonts.universBold);
        const title = await pdf.embedFont(pdfFonts.universBlack);

        const titleColor = rgb(0.066, 0.227, 0.329);
        const subtitleColor = rgb(0.671, 0.561, 0.361);
        const headingColor = rgb(0.475, 0.620, 0.702);
        const subheadingColor = rgb(0.784, 0.678, 0.424);
        const bodyColor = rgb(0.120, 0.118, 0.149);

        const icons = await pdf.embedFont(pdfFonts.urbanIcons);
        const urban = await pdf.embedFont(pdfFonts.universBold);
        const archaeology = await pdf.embedFont(pdfFonts.trajan);

        const page = pdf.addPage();
        page.setSize(2550, 3300);

        page.setFontColor(bodyColor);
        page.setFont(body);

        page.drawText("urbarch_logo", {font: icons, size: 200, x: 150, y: 2950, color: titleColor, opacity: 0.1});
        page.drawText("urban", {font: urban, size: 60, x: 300, y: 3020, color: titleColor, opacity: 0.5});
        page.drawText("A R C H A E O L O G Y", {font: archaeology, size: 60, x: 480, y: 3020, color: titleColor, opacity: 0.5});

        page.drawText("Copyright © Urban Archaeology Ltd. All rights reserved.", {
            size: 30, x: (2550 - body.widthOfTextAtSize("Copyright © Urban Archaeology Ltd. All rights reserved.", 30)) / 2.0, y: 150, opacity: 0.75
        });

        const productData = (await Database`
            WITH variations AS (
                SELECT productID, extension, subname, description, (
                    SELECT COALESCE(json_agg(json_build_object(
                        'id', finish.code,
                        'display', finish.name,
                        'value', variation_finish.price
                    )), '[]') FROM finish INNER JOIN variation_finish ON variation_finish.finishCode = finish.code
                    WHERE variation_finish.variationID = variation.id
                ) AS finishes, overview, (
                    SELECT json_build_object(
                        'name', tag.name,
                        'category', tag.category
                    ) FROM tag INNER JOIN variation_tag ON variation_tag.tagID = tag.id
                    WHERE variation_tag.variationID = variation.id AND tag.category = 'Class'
                ) AS class, (
                    SELECT json_build_object(
                        'name', tag.name,
                        'category', tag.category
                    ) FROM tag INNER JOIN variation_tag ON variation_tag.tagID = tag.id
                    WHERE variation_tag.variationID = variation.id AND tag.category = 'Category'
                ) AS category
                FROM variation WHERE productID = ${id} AND display = TRUE
            )
            SELECT product.id, variations.extension, product.name, variations.subname, product.description, variations.description, 
                variations.finishes, variations.overview, variations.class, variations.category
            FROM product INNER JOIN variations ON product.id = variations.productID
            WHERE product.id = ${id} AND variations.extension = ${extension};
        `)[0];

        pdf.setTitle(`${productData.name}${productData.subname !== ""? ` [${productData.subname}]` : ""} Cutsheet`);

        const currentDay = new Date();
        pdf.setCreationDate(currentDay);
        const generatedOn = `Auto-generated on ${currentDay.toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})}.`;
        page.drawText(generatedOn, {
            size: 20, x: 2550 - body.widthOfTextAtSize(generatedOn, 20) - 40, y: 40, opacity: 0.5
        });

        page.drawText(productData.class.name.toLowerCase().replace(" ", "_"), {font: icons, size: 2000, x: 1000, y: -200, color: titleColor, opacity: 0.05});
        // page.drawText(productData.category.name, {font: title, size: 50, x: 2550 - (title.widthOfTextAtSize(productData.category.name, 50) + 150), y: 3020, color: subtitleColor, opacity: 0.5});

        const columnWidth = 1050;

        let image = (await import(`../../../assets/images/products/${id}/${extension}/card.jpg`)).default;
        if(image) {
            const thumbnail = await fetch(`${BASE_URL}${image.src}`).then(async response => pdf.embedJpg(await response.arrayBuffer()));
            const thumbnailDimensions = thumbnail.scale(1);
            page.drawImage(thumbnail, {
                x: 150, y: 2800 - (columnWidth / thumbnailDimensions.width) * thumbnailDimensions.height,
                width: columnWidth, height: (columnWidth / thumbnailDimensions.width) * thumbnailDimensions.height
            });
        }
        image = (await import(`../../../assets/images/products/${id}/${extension}/drawing.jpg`).catch(() => undefined))?.default;
        if(image) {
            const drawing  = await fetch(`${BASE_URL}${image.src}`).then(async response => pdf.embedJpg(await response.arrayBuffer()));
            const drawingDimensions = drawing.scale(1);
            page.drawImage(drawing, {
                x: 150, y: 2800 - (columnWidth / drawingDimensions.width) * drawingDimensions.height - 1200,
                width: columnWidth, height: (columnWidth / drawingDimensions.width) * drawingDimensions.height
            });
        }

        page.drawText(productData.name, {font: title, size: 60, x: 1350, y: 2740, color: titleColor});
        let longTitle = false;
        if(productData.subname !== "NONE") {
            longTitle = title.widthOfTextAtSize(productData.name, 60) + title.widthOfTextAtSize(productData.subname, 60) + 20 > 1350;
            page.drawText(productData.subname, {
                font: title, size: 60,
                x: 1350 + title.widthOfTextAtSize(productData.name, 60) + 20, y: 2740,
                color: subtitleColor
            });
        }
        page.drawText(
            `${productData.id}${productData.extension !== "NONE"? `-${productData.extension}` : ""}`,
            {size: 40, x: 1350, y: longTitle? 2600 : 2680, opacity: 0.75}
        );
        page.drawText(
            `Starting at $${parseFloat(productData.finishes.reduce((min, {value}) => min < value? min : value, Infinity)).toLocaleString('en', {useGrouping: true})}`,
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

        if(productData.finishes.length > 1) {
            const finishPrices = {};
            for(const {display, value} of productData.finishes) {
                if(!finishPrices[value])
                    finishPrices[value] = [];
                finishPrices[value].push(display);
            }

            yPos -= subtitleSize;
            page.drawText("Finishes", {font: title, size: subtitleSize, x: xPos, y: yPos, color: subtitleColor});
            yPos -= subtitleGap;
            const maxWidth = Math.max(...Object.entries(finishPrices).map(([value]) => {
                value = parseFloat(value);
                return emphasis.widthOfTextAtSize(value === Infinity? "Call for pricing" : `$${value}`, bodySize)
            }));
            for(const [value, entries] of Object.entries(finishPrices)) {
                const valueAsFloat = parseFloat(value);
                page.drawText(valueAsFloat === Infinity? "Call for pricing" : `$${valueAsFloat}`, {
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

        if(productData.overview.bulb?.quantity > 0) {
            yPos -= subtitleSize;
            page.drawText("Bulb Info", {font: title, size: subtitleSize, x: xPos, y: yPos, maxWidth: columnWidth, color: subtitleColor});
            yPos -= subtitleGap;
            const bulbInfo = `${productData.overview.bulb.shape.name} Bulb (${productData.overview.bulb.shape.code}) ${productData.overview.bulb.socket.name} Base (${productData.overview.bulb.socket.code})`;
            for(const line of [...breakTextIntoLines(bulbInfo, [' '], columnWidth, (word) => body.widthOfTextAtSize(word, bodySize)), ...breakTextIntoLines(`${productData.overview.bulb.specifications} recommended.`, [' '], columnWidth, (word) => body.widthOfTextAtSize(word, bodySize)), `(${productData.overview.bulb.quantity} count)`]) {
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

        if(productData.overview.ul?.length > 0 && productData.overview.ul[0] !== "None") {
            yPos -= subtitleSize;
            page.drawText("UL Listing", {font: title, size: subtitleSize, x: xPos, y: yPos, maxWidth: columnWidth, color: subtitleColor});
            yPos -= subtitleGap;
            yPos -= bodySize;
            page.drawText(`This product is listed for use in ${productData.overview.ul[0].toUpperCase()} environments.`, {size: bodySize, x: xPos, y: yPos});
            yPos -= bodyGap;
            yPos -= sectionGap;
        }

        if(productData.replacements?.length > 0) {
            yPos -= subtitleSize;
            page.drawText("Replacements", {font: title, size: subtitleSize, x: xPos, y: yPos, maxWidth: columnWidth, color: subtitleColor});
            yPos -= subtitleGap;

            let column0MaxWidth = 0, column1MaxWidth = 0;
            productData.replacements.forEach(replacement => {
                let check = 0;

                check = body.widthOfTextAtSize(`$${replacement.price}`, bodySize);
                column0MaxWidth = check > column0MaxWidth? check : column0MaxWidth;

                check = body.widthOfTextAtSize(`${replacement.name}${replacement.subname !== "NONE"? ` [${replacement.subname}]` : ""}`, bodySize);
                column1MaxWidth = check > column1MaxWidth? check : column1MaxWidth;
            })
            for(const replacement of productData.replacements) {
                yPos -= bodySize;
                page.drawText(`$${replacement.price}`, {size: bodySize, x: xPos, y: yPos});
                page.drawText(`${replacement.name}${replacement.subname !== "NONE"? ` [${replacement.subname}]` : ""}`, {
                    size: bodySize, x: xPos + column0MaxWidth + tabSize, y: yPos
                });
                page.drawText(`${replacement.id}${replacement.extension !== "NONE"? `-${replacement.extension}` : ""}`, {
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

        if(productData.overview.notes && productData.overview.notes !== "") {
            yPos -= subtitleSize;
            page.drawText("Notes", {font: title, size: subtitleSize, x: xPos, y: yPos, maxWidth: columnWidth, color: subtitleColor});
            yPos -= subtitleGap;
            
            for(const line of breakTextIntoLines(productData.overview.notes, [' '], columnWidth, word => body.widthOfTextAtSize(word, bodySize))) {
                yPos -= bodySize;
                page.drawText(line, {size: bodySize, x: xPos, y: yPos});
                yPos -= bodyGap;
            }
            yPos -= sectionGap;
        }

        return new Response(await pdf.saveAsBase64({dataUri: true}), {
            "status": 200
        });
    } catch(error) {
        console.log(error);
        return new Response("Server Error: Couldn't generate PDF.", {
            "status": 500
        });
    }
}