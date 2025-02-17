"use client"
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import {useState, useEffect, useContext} from 'react';
import {tss} from 'tss-react';
import {DarkModeContext, useTheme} from './theme';
import Icon from './icon-comp';

const useStyles = tss.create(({theme, transparent, open}) => ({
    header: {
        width: "100%",
        position: "fixed",
        top: 0,
        zIndex: 1000,
        backgroundColor: transparent? "transparent" : theme.surface,
        color: transparent? theme.lightFont : theme.body,

        "& a": {
            textDecoration: "none",
            color: transparent? theme.lightFont : theme.body,
        }
    },
    content: {
        width: "100%",
        maxWidth: "1500px",
        margin: "auto",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    branding: {
        display: "flex",
        alignItems: "center",
        gap: "10px",

        "& .logo": {
            fontSize: "48px",
            color: transparent? theme.lightFont : theme.body,
        },
        "& .urban": {
            fontWeight: "bold",
            fontSize: "1.25rem",
            margin: "10px",

            "@media (max-width: 500px)": {
                display: "none"
            }
        },
        "& .archaeology": {
            fontFamily: "var(--trajan)",
            fontWeight: "bold",
            fontSize: "1.25rem",
            fontKerning: "none",
            letterSpacing: "0.5rem",

            "@media (max-width: 500px)": {
                display: "none"
            }
        }
    },
    menu: {
        display: "flex",
        alignItems: "center",
        gap: "30px",
        
        "& .navigation": {
            display: "flex",
            alignItems: "center",
            gap: "30px",

            "@media (max-width: 900px)": {
                display: "none"
            },

            "& .active": {
                fontWeight: "bold"
            }
        },
        "& .sidebar-button": {
            display: "none",
            color: transparent? theme.lightFont : theme.body,
            "@media (max-width: 900px)": {
                display: "flex"
            },
        },
        "& .dark-mode": {
            "@media (max-width: 600px)": {
                display: "none"
            }
        }
    },
    sidebar: {
        width: "100vw",
        height: 0,
        position: "fixed",
        inset: 0,

        "& .scrim": {
            width: "100vw",
            height: "100vh",
            display: open? "block" : "none",
            position: "fixed",
            inset: 0,
            backgroundColor: theme.darkFont,
            opacity: 0.75
        },
        "& .navigation": {
            width: open? "300px" : 0,
            maxWidth: "80%",
            height: "100vh",
            position: "fixed",
            right: 0,
            float: "right",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            padding: "20px",
            paddingLeft: 0,
            paddingRight: 0,
            gap: "20px",
            borderRadius: "20px 0 0 20px",
            backgroundColor: theme.surface,
            transition: open? 
                "width 300ms ease-in, padding 300ms cubic-bezier(0,1,0,1), background-color 300ms ease-in-out"
                :
                "width 300ms ease-out, padding 300ms cubic-bezier(1,0,1,0), background-color 300ms ease-in-out",
            
            "& .buttons": {
                overflow: "hidden",
                marginLeft: "20px",
                marginRight: "20px",
                display: "flex", 
                gap: "30px",
                alignItems: "center",
                justifyContent: "flex-end"
            },
            "& .links": {
                marginLeft: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",

                "& .active": {
                    fontWeight: "bold"
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
    const [hovered, setHovered] = useState(false);
    const [moved, setMoved] = useState(false); // Keeps track of if the header has scrolled
    // Here we create the event listener for scrolling
    useEffect(() => {
        window.addEventListener('scroll', () => {
            setMoved(true) // The moved is by default set to true
            if(window.scrollY == 0)
                setMoved(false); // If the window has returned to scroll 0, then it gets set back to false
        });
        if(window.scrollY != 0)
                setMoved(true); // If the window has returned to scroll 0, then it gets set back to false
    }, []);

    const pathname = usePathname();
    useEffect(() => {
        setOpen(false);
    }, [pathname]);
    
    const [open, setOpen] = useState(false); // This keeps track of the modal state
    const [darkMode, toggleDarkMode] = useContext(DarkModeContext); // This is the dark mode context

    const theme = useTheme();
    const {classes} = useStyles({theme, transparent: !hovered && !moved && !open, open});
    return (
        <section className={classes.header} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div className={classes.content}>
                <Link className={classes.branding} href="/">
                    <Icon className="logo" iconGroup="urban-icons" icon="urbarch_logo" />
                    <div>
                        <span className="urban">urban</span>
                        <span className="archaeology">ARCHAEOLOGY</span>
                    </div>
                </Link>
                <div className={classes.menu}>
                    <div className="navigation">
                        <Link className={pathname === '/catalog'? "active" : ""} href="/catalog">Catalog</Link>
                        <Link className={pathname === '/salvage'? "active" : ""} href="/salvage">Salvage</Link>
                        <Link className={pathname === '/gallery'? "active" : ""} href="/gallery">Gallery</Link>
                        {/* <Icon className="cart" role="primary" style="text" icon='shopping_cart' /> */}
                    </div>
                    <Icon className="dark-mode" role="secondary" appearance="outlined" button icon={darkMode? "dark_mode" : "light_mode"} onPress={toggleDarkMode} />
                    <Icon className="sidebar-button" role="primary" appearance="text" button icon="menu_open" onPress={() => setOpen(true)} />
                </div>
            </div>
            <div className={classes.sidebar}>
                <div className="scrim" onMouseDown={() => setOpen(false)} />
                <div className="navigation">
                    <div className="buttons">
                        {/* <Icon className="cart" role="primary" style="text" icon='shopping_cart' /> */}
                        <Icon className="dark-mode" role="secondary" appearance="outlined" button icon={darkMode? "dark_mode" : "light_mode"} onPress={toggleDarkMode} />
                        <Icon button icon="close" onPress={() => setOpen(false)} />
                    </div>
                    <div className='links'>
                        <Link className={pathname === '/catalog'? "active" : ""} href="/catalog">Catalog</Link>
                        <Link className={pathname === '/salvage'? "active" : ""} href="/salvage">Salvage</Link>
                        <Link className={pathname === '/gallery'? "active" : ""} href="/gallery">Gallery</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}