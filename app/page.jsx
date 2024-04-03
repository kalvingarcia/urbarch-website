"use client"
import {createUseStyles} from 'react-jss';
import Header from './components/header';
import Hero from './components/hero';

const cssStyleReset = createUseStyles(theme => ({
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
            backgroundColor: theme.background,
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
        },
        ".material-icons": {
            fontFamily: "var(--material-icons)",
            fontWeight: "normal",
            fontStyle: "normal",
            fontSize: "48px",
            display: "inline-block",
            lineHeight: 1,
            textTransform: "none",
            letterSpacing: "normal",
            wordWrap: "normal",
            whiteSpace: "nowrap",
            direction: "ltr",

            "-webkit-font-smoothing": "antialiased",
            textRendering: "optimizeLegibility",
            "-moz-osx-font-smoothing": "grayscale",
            fontFeatureSettings: "'liga'"
        }
    }
})

export default function Home() {
    cssStyleReset();

    return (
        <main>
            <Header />
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