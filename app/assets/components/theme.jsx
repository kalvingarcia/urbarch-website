'use client'
import {useState, createContext, useContext, useEffect} from 'react';
import {GlobalStyles, tss} from 'tss-react';
import {NextAppDirEmotionCacheProvider} from 'tss-react/next/appDir';

export const DarkModeContext = createContext();
export function useDarkMode() {
    return useContext(DarkModeContext);
}

// Theme Colors
const seaSalt = "#F6F6F6"; // Light Font Color or Light Background Color
const raisinBlack =  "#1C1E26"; // Dark Font Color or Dark Background Color

const platinum =  "#ECECEE"; // Light Surface Color
const onyx =  "#222534"; // Dark Surface Color

const aliceBlue =  "#D0E0E6"; // Primary Light Color
const airForce =  "#799EB3"; // Primary Mid Color
const prussianBlue =  "#113A54"; // Primary Dark Color

const alabaster =  "#E8E8DA"; // Secondary Light Color
const flax =  "#C8AD6C"; // Secondary Mid Color
const lion =  "#AB8F5C"; // Secondary Dark Color

const clot =  "#C2AEAE"; // Error Light Color
const wine =  "#4F1E2B"; // Error Dark Color

const ThemeContext = createContext();
export function useTheme() {
    return useContext(ThemeContext);
}

const styles = {
    "*": {
        boxSizing: "border-box",
        "&::before, &::after": {
            boxSizing: "border-box"
        }
    },
    html: {
        MozTextSizeAdjust: "none",
        WebkitTextSizeAdjust: "none",
        textSizeAdjust: "none",
        "& *": {
            transition: "background-color 300ms ease-in-out"
        }
    },
    "body, h1, h2, h3, h4, p, figure, blockquote, dl, dd": {
        margin: 0
    },
    "ul[role=\"list\"], ol[role=\"list\"]": {
        listStyle: "none"
    },
    "html, body": {
        position: "relative",
        width: "100%",
        minWidth: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        minHeight: "100vh",
        lineHeight: 1.5,
        overscrollBehavior: "none",

        fontFamily: "var(--univers)",
        fontWeight: 400,
        fontStyle: "normal",

        "@media print": {
            fontSize: "0.85rem"
        }
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
    "input, button, textarea, select": {
        font: "inherit"
    },
    textarea: {
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

        WebkitFontSmoothing: "antialiased",
        textRendering: "optimizeLegibility",
        MozOsxFontSmoothing: "grayscale",
        fontFeatureSettings: "liga"
    },
    ".urban-icons": {
        fontFamily: "var(--urban-icons)",
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

        WebkitFontSmoothing: "antialiased",
        textRendering: "optimizeLegibility",
        MozOsxFontSmoothing: "grayscale",
        fontFeatureSettings: "liga"
    }
};

const useStyles = tss.create(({theme}) => ({
    root: {
        width: "100%",
        backgroundColor: theme.background,
        color: theme.body
    }
}));

export default function Theme({defaultDarkMode, setDarkModeCookie, children}) {
    const [darkMode, setDarkMode] = useState(defaultDarkMode); // This keeps track of dark mode
    // The function to toggle dark mode
    const toggleDarkMode = async () => {
        setDarkMode(!darkMode);
        await setDarkModeCookie(!darkMode);
    }

    const [theme, setTheme] = useState({
        title: darkMode? aliceBlue : prussianBlue,
        subtitle: darkMode? flax : flax,
        heading:  darkMode? airForce : airForce,
        subheading:  darkMode? alabaster : flax,
        body:  darkMode? seaSalt : raisinBlack,
    
        lightFont: seaSalt,
        darkFont: raisinBlack,
    
        background:  darkMode? raisinBlack : seaSalt,
        surface:  darkMode? onyx : platinum,
    
        primary:  darkMode? prussianBlue : aliceBlue,
        onPrimary:  darkMode? aliceBlue : prussianBlue,
        secondary:  darkMode? lion : alabaster,
        onSecondary:  darkMode? alabaster : flax,
    
        error:  darkMode? wine : clot,
        onError:  darkMode? clot : wine
    });
    useEffect(() => {
        setTheme({
            title: darkMode? aliceBlue : prussianBlue,
            subtitle: darkMode? flax : flax,
            heading:  darkMode? airForce : airForce,
            subheading:  darkMode? alabaster : flax,
            body:  darkMode? seaSalt : raisinBlack,
        
            lightFont: seaSalt,
            darkFont: raisinBlack,
        
            background:  darkMode? raisinBlack : seaSalt,
            surface:  darkMode? onyx : platinum,
        
            primary:  darkMode? prussianBlue : aliceBlue,
            onPrimary:  darkMode? aliceBlue : prussianBlue,
            secondary:  darkMode? lion : alabaster,
            onSecondary:  darkMode? alabaster : flax,
        
            error:  darkMode? wine : clot,
            onError:  darkMode? clot : wine
        });
    }, [darkMode]);

    const {classes} = useStyles({theme});
    // We send darkMode and toggleDarkMode so that any component can access the darkMode information and change it
    return (
        <NextAppDirEmotionCacheProvider options={{key: "urban-styles"}}>
            <DarkModeContext.Provider value={[darkMode, toggleDarkMode]}>
                <ThemeContext.Provider value={theme}>
                    <GlobalStyles styles={styles} />
                    <div className={darkMode? 'theme--dark' : 'theme--light'}>
                        <div id="theme-root" className={classes.root}>
                            {children}
                        </div>
                    </div>
                </ThemeContext.Provider>
            </DarkModeContext.Provider>
        </NextAppDirEmotionCacheProvider>
    );
}

