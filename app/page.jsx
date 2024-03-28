"use client"
// import  {useState, useEffect} from 'react';
import {createUseStyles} from 'react-jss';

import Hero from './components/hero';

const cssStyleReset = createUseStyles({
    // Here we have the CSS global reset
    "@global": {
        "*": {
            boxSizing: "border-box",
            "&::before, &::after": {
                boxSizing: "border-box"
            }
        },
        "html": {
            "-moz-text-size-adjust": "none",
            "-webkit-text-size-adjust": "none",
            textSizeAdjust: "none"
        },
        "body, h1, h2, h3, h4, p, figure, blockquote, dl, dd": {
            margin: 0
        },
        "ul[role=\"list\"], ol[role=\"list\"]": {
            listStyle: "none"
        },
        body: {
            minHeight: "100vh",
            lineHeight: 1.5,
            overscrollBehavior: "none" // This part was specifically to avoid MacOS overscroll, which was bugging me.
        },
        "h1, h2, h3, h4, button, input, label": {
            lineHeight: 1
        },
        "h1, h2, h3, h4": {
            textWrap: "balance"
        },
        a: {
            "&:not([class])": {
                textDecorationSkipInk: "auto",
                color: "currentcolor"
            }
        },
        "img, picture": {
            maxWidth: "100%",
            display: "block"
        },
        "inputSecurity, button, textarea, select": {
            font: "inherit"
        },
        "textarea": {
            "&:not([rows])": {
                minHeight: "10em"
            }
        },
        ":target": {
            scrollMarginBlock: "5ex"
        }
    }
})

export default function Home() {
    cssStyleReset();

    return (
        <main>
            <Hero />
            <div style={{backgroundColor: "white", height: "2000px", width: "100%"}} />
        </main>
    )
}

// useEffect(() => {
//     fetch("http://localhost:3000/api/tag").then(response => {
//         return response.json();
//     }).then(result => {
//         const tag_list = [];
//         for(const [name, category] of Object.entries(result)) {
//             for(const tag of category) {
//                 tag_list.push(tag.name);
//             }
//         }
//         set_tags(tag_list);
//     });
// }, []);