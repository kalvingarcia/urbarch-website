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
    const body = await pdf.embedFont(pdfFonts.universLight);
    const emphasis = await pdf.embedFont(pdfFonts.universRoman);
    const heading = await pdf.embedFont(pdfFonts.universBold);
    const title = await pdf.embedFont(pdfFonts.universBlack);

    const icons = await pdf.embedFont(pdfFonts.urbanIcons);
    const urban = await pdf.embedFont(pdfFonts.universBold);
    const archaeology = await pdf.embedFont(pdfFonts.trajan);

    let image = (await import(`../../../assets/images/products/${id}/${extension}/card.jpg`)).default;
    const thumbnail = await fetch(`${BASE_URL}${image.src}`).then(async response => pdf.embedJpg(await response.arrayBuffer()));
    // image = (await import(`../../../assets/images/products/${id}/${extension}/drawing.jpg`)).default;
    // const drawing  = await fetch(`${BASE_URL}${image.src}`).then(async response => pdf.embedJpg(await response.arrayBuffer()));

    const page = pdf.addPage();
    page.setSize(2550, 3300);

    const titleColor = rgb(0.066, 0.227, 0.329);
    const subtitleColor = rgb(0.671, 0.561, 0.361);
    const headingColor = rgb(0.475, 0.620, 0.702);
    const subheadingColor = rgb(0.784, 0.678, 0.424);
    const bodyColor = rgb(0.120, 0.118, 0.149);

    page.setFontColor(bodyColor);
    page.setFont(body);

    page.drawText(productData.class.name.toLowerCase(), {font: icons, size: 2500, x: 1000, y: -400, color: titleColor, opacity: 0.1});
    page.drawText("urbarch_logo", {font: icons, size: 200, x: 150, y: 2950, color: titleColor, opacity: 0.1});
    page.drawText("urban", {font: urban, size: 60, x: 300, y: 3020, color: titleColor, opacity: 0.5});
    page.drawText("A R C H A E O L O G Y", {font: archaeology, size: 60, x: 480, y: 3020, color: titleColor, opacity: 0.5});
    page.drawText(productData.category.name, {font: title, size: 50, x: 2550 - (title.widthOfTextAtSize(productData.category.name, 50) + 150), y: 3020, color: subtitleColor, opacity: 0.5});

    const columnWidth = 1050;
    
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

    const sectionGap = 45;
    const subtitleSize = 50;
    const subtitleGap = 25;
    const headingSize = 40;
    const headingGap = 20;
    const bodySize = 30;
    const bodyGap = 15;
    const tabSize = 30;

    const xPos = 1350;
    let yPos = 2440;

    const recursiveDrawOptions = (name, value, level = 0, links = []) => {
        const drawOption = prices => {
            const currentHeadingSize = Math.max(headingSize / (level + 1), 15);
            const currentBodySize = Math.max(bodySize / (level + 1), 10);

            yPos -= currentHeadingSize;
            page.drawText(name[0].toUpperCase() + name.slice(1), {
                font: heading, size: currentHeadingSize,
                x: xPos + level * tabSize, y: yPos,
                color: level % 2? subheadingColor : headingColor, maxWidth: columnWidth - level * tabSize
            });
            yPos -= headingGap;

            for(const [difference, choices] of prices) {
                const priceChange = `${Math.sign(difference) === -1? "-" : "+"}$${Math.abs(difference).toLocaleString('en', {useGrouping: true})} to starting price`;
                page.drawText(priceChange, {
                    font: emphasis, size: currentBodySize,
                    x: xPos + (level + 1) * tabSize, y: yPos - currentBodySize,
                    maxWidth: columnWidth - (level + 1) * tabSize
                });
                const choiceList = choices.map(choice => choice.replace(/ \${([A-z\-\[\] ]+,?)+}/g, "")).join(', ');

                for(const line of breakTextIntoLines(choiceList, [' '], columnWidth - (emphasis.widthOfTextAtSize(priceChange, currentBodySize) + tabSize + (level + 1) * tabSize), (word) => body.widthOfTextAtSize(word, currentBodySize))) {
                    yPos -= currentBodySize;
                    page.drawText(line, {
                        size: currentBodySize,
                        x: emphasis.widthOfTextAtSize(priceChange, bodySize) + tabSize + xPos + (level + 1) * tabSize, y: yPos,
                        maxWidth: columnWidth - (emphasis.widthOfTextAtSize(priceChange, bodySize) + tabSize + (level + 1) * tabSize)
                    });
                    yPos -= bodyGap;

                    for(const dep of value.deps) 
                        recursiveDrawOptions(dep, serialized[dep], level + 1, choices);
                }
            }
        }

        if(links.length === 0) {
            drawOption(Object.entries(value.prices));
        } else {
            let prices = {}
            for(const [difference, choices] of Object.entries(value.prices))
                for(const choice of choices) {
                    const match = choice.match(/\${([A-z\-\[\] ]+,?)+}/g);
                    const deps = match? match[0].replace(/\${|}/g, "").split(",") : [];

                    if(deps.length === 0 || deps.find(dep => links.includes(dep))) {
                        if(!prices[difference])
                            prices[difference] = [];
                        prices[difference].push(choice);
                    }
                }
            
            prices = Object.entries(prices);
            if(prices.length > 0) {
                drawOption(prices);
            }

            // const links = choice.display.match(/\${([A-z\-\[\] ]+,?)+}/g);
            // const display = choice.display.replace(/ \${([A-z\-\[\] ]+,?)+}/g, "");
        }
    };

    // for(const [name, value] of Object.entries(serialized))
    //     if(!value.link)
    recursiveDrawOptions("Finishes", serialized["finishes"]);
    yPos -= sectionGap;

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