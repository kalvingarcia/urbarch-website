"use client"
import Link from 'next/link';
import React, {useState, useEffect, useContext, useCallback} from 'react';
import {createUseStyles} from 'react-jss';
import {DarkModeContext} from './theme';
import IconButton from './icon-button';
import "../assets/styles/components/header.scss";

const useStyles = createUseStyles(theme => ({
    // Declaring the styles we're going to use inside the header
    branding: {},
    urban: {},
    archaeology: {},
    menu: {},
    navigation: {},
    modalButton: {},
    darkMode: {},
    modal: {},
    scrim: {},
    buttons: {},

    // This is where the styling for the header actually takes place
    header: {
        // This is the styling to keep the header formatted in an appealing way
        width: "100%",
        padding: "20px",

        // This is the styling to make the header stay at the top of the screen
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        zIndex: 100,

        // This styles the background and text colors which will change when the user
        // hovers or scrolls since the header is fixed to the top
        backgroundColor: ({hovered, moved, open}) => hovered || moved || open? theme.surface : "transparent", // For some reason dynamic values only work after mounting a second time
        color: ({hovered, moved, open}) => hovered || moved || open? theme.body : theme.lightFont, // For some reason dynamic values only work after mounting a second time
        "& a": {
            textDecoration: "none",
            color: ({hovered, moved, open}) => hovered || moved || open? theme.body : theme.lightFont // For some reason dynamic values only work after mounting a second time
        },

        // The branding part of the header
        // Formatting the logo icon and logo text
        "& $branding": {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            "& i": {},
            "& $urban": {
                fontWeight: "bold",
                fontSize: "1.25rem",
                margin: "10px",
                '@media (max-width: 500px)': { // On mobile, we hide the logo text
                    display: "none"
                }
            },
            "& $archaeology": {
                fontFamily: "var(--cinzel)",
                fontWeight: "bold",
                fontSize: "1.25rem",
                fontKerning: "none",
                letterSpacing: "0.5rem",
                '@media (max-width: 500px)': { // On mobile, we hide the logo text
                    display: "none"
                }
            }
        },

        "& $menu": {
            display: "flex",
            alignItems: "center",
            gap: "40px",
            // The navigation part of the header where the text is evenly spaced
            // We use media queries to make the text go away and instead show a hamburger
            "& $navigation": {
                display: "flex",
                alignItems: "center",
                gap: "30px",
                "& a": {
                },
                "& i": {
                    fontSize: "24px",
                },
                '@media (max-width: 900px)': {
                    display: "none"
                }
            },
            "& $modalButton": {
                display: "none",
                '@media (max-width: 900px)': {
                    color: ({hovered, moved, open}) => hovered || moved || open? theme.body : theme.lightFont, // For some reason dynamic values only work after mounting a second time
                    display: "flex"
                }
            },
            "& $darkMode": {
                '@media (max-width: 600px)': { // When the text is close enough to the buttons it starts to push them off the page
                    display: "none" // I'd rather hide the buttons
                }
            }
        },

        // When the window is thin enough, we display a button to open a modal navigation menu
        "& $modal": {
            height: 0,
            width: "100vw",
            position: "absolute",
            top: 0,
            left: 0,
            "& $scrim": { // This is the slightly transparent background that hides the content behind the modal
                height: "100vh",
                width: "100vw",
                display: ({open}) => open? "block" : "none",
                position: "fixed",
                top: 0,
                left: 0,
                backgroundColor: theme.darkFont,
                opacity: 0.5,
            },
            "& $navigation": { // Here we restyle the navigation class to be inside the modal
                width: ({open}) => open? "400px" : 0,
                height: "100vh",
                position: "fixed",
                right: 0,
                float: "right",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                padding: "20px",
                paddingLeft: ({open}) => open? "20px" : 0,
                paddingRight: ({open}) => open? "20px" : 0,

                gap: "20px",

                backgroundColor: theme.surface,
                borderRadius: "20px 0px 0px 20px",
                transition: ({open}) => (
                    open? // depending on if the modal is open or closed, the transition is different
                        ["width 300ms ease-in", "padding 300ms cubic-bezier(0,1,0,1)", "background-color 300ms ease-in-out"]
                        : ["width 300ms ease-out", "padding 300ms cubic-bezier(1,0,1,0)", "background-color 300ms ease-in-out"]
                ),
                "& $buttons": {
                    display: "flex",
                    gap: "40px",
                    alignItems: "center",
                    justifyContent: "end"
                }
            }
        }
    }
}));

/**
 * This is the header component for the website. The idea is that it's persistent along the length of the page.
 * This means it's fixed to the top of the page, but while it's resting at scroll 0 (when the user hasn't scrolled
 * along the page) and the user isn't hovering it, the header's background is transparent, so that it can blend
 * with the hero/banner at the top of the page.
 */
export default function Header() {
    const [hovered, setHovered] = useState(false); // Keeps track of if the header is hovered
    const [moved, setMoved] = useState(false); // Keeps track of if the header has scrolled
    // Here we create the event listener for scrolling
    useEffect(() => {
        window.addEventListener('scroll', () => {
            setMoved(true) // The moved is by default set to true
            if(window.scrollY == 0)
                setMoved(false); // If the window has returned to scroll 0, then it gets set back to false
        });
    }, []);
    
    const [open, setOpen] = useState(false); // This keeps track of the modal state

    const [darkMode, toggleDarkMode] = useContext(DarkModeContext); // This is the dark mode context
    const styles = useStyles({hovered, moved, open}); // Here we get the jss styles for the header
    return (
        <section className={["header", open? "open" : "", moved? "moved" : ""].join(" ")} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <Link className="branding" href="/">
                <i className='urban-icons'>urbarch_logo</i>
                <div>
                    <span className="urban">urban</span>
                    <span className="archaeology">ARCHAEOLOGY</span>
                </div>
            </Link>
            <div className="menu">
                <div className="navigation">
                    <Link href="/catalog">Catalog</Link>
                    <Link href="/salvage">Salvage</Link>
                    <Link href="/gallery">Gallery</Link>
                    <i className='material-icons'>shopping_cart</i>
                </div>
                <IconButton className="darkMode" role="secondary" style="outlined" icon={darkMode? "dark_mode" : "light_mode"} onPress={toggleDarkMode} />
                <IconButton className="modalButton" role="primary" style="text" icon="menu_open" onPress={() => setOpen(true)} />
            </div>
            <div className="modal">
                <div className="scrim" onMouseDown={() => setOpen(false)} />
                <div className="navigation">
                    <div className="buttons">
                        <IconButton className="darkMode" role="secondary" style="outlined" icon={darkMode? "dark_mode" : "light_mode"} onPress={toggleDarkMode} />
                        <IconButton icon="close" onPress={() => setOpen(false)} />
                    </div>
                    <Link href="/catalog">Catalog</Link>
                    <Link href="/salvage">Salvage</Link>
                    <Link href="/gallery">Gallery</Link>
                </div>
            </div>
        </section>
    );
}