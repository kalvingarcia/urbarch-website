"use client"
import Link from 'next/link';
import React, {useState, useEffect, useContext} from 'react';
import {createUseStyles} from 'react-jss';
import {DarkModeContext} from './theme';

const useStyles = createUseStyles(theme => ({
    branding: {},
    urban: {},
    archaeology: {},
    menu: {},
    navigation: {},
    hamburger: {},
    darkMode: {},
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
        backgroundColor: ({hovered, moved}) => hovered || moved? theme.surface : "transparent", // For some reason dynamic values only work after mounting a second time
        transition: "background-color 300ms ease-in-out",
        color: ({hovered, moved}) => hovered || moved? theme.body : theme.lightFont, // For some reason dynamic values only work after mounting a second time
        "& a": {
            textDecoration: "none",
            color: ({hovered, moved}) => hovered || moved? theme.body : theme.lightFont // For some reason dynamic values only work after mounting a second time
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
                margin: "10px"
            },
            "& $archaeology": {
                fontFamily: "var(--cinzel)",
                fontWeight: "bold",
                fontSize: "1.25rem",
                fontKerning: "none",
                letterSpacing: "0.5rem",
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
            "& $hamburger": {
                display: "none",
                '@media (max-width: 900px)': {
                    display: "block",
                    fontSize: "36px",
                }
            },
            "& $darkMode": {
                '@media (max-width: 600px)': {
                    display: "none"
                }
            }
        }
    }
}));

export default function Header() {
    const [hovered, setHovered] = useState(false);
    const [moved, setMoved] = useState(false);
    useEffect(() => {
        window.addEventListener('scroll', () => {
            setMoved(true)
            if(window.scrollY == 0)
                setMoved(false)
        });
    }, []);

    const [darkMode, toggleDarkMode] = useContext(DarkModeContext);

    const styles = useStyles({hovered, moved});
    return (
        <section className={styles.header} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <Link className={styles.branding} href="/">
                <i className='urban-icons'>urbarch_logo</i>
                <div>
                    <span className={styles.urban}>urban</span>
                    <span className={styles.archaeology}>ARCHAEOLOGY</span>
                </div>
            </Link>
            <div className={styles.menu}>
                <div className={styles.navigation}>
                    <Link href="/catalog">Catalog</Link>
                    <Link href="/salvage">Salvage</Link>
                    <Link href="/gallery">Gallery</Link>
                    <i className='material-icons'>shopping_cart</i>
                </div>
                <i className={`material-icons ${styles.hamburger}`}>menu_open</i>
                <i className={`material-icons ${styles.darkMode}`} onClick={toggleDarkMode}>{darkMode? "dark_mode" : "light_mode"}</i>
            </div>
        </section>
    );
}