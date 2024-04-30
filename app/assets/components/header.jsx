"use client"
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import {useState, useEffect, useContext} from 'react';
import {DarkModeContext} from './theme';
import IconButton from './icon-button';
import "../styles/components/header.scss";

/**
 * This is the header component for the website. The idea is that it's persistent along the length of the page.
 * This means it's fixed to the top of the page, but while it's resting at scroll 0 (when the user hasn't scrolled
 * along the page) and the user isn't hovering it, the header's background is transparent, so that it can blend
 * with the hero/banner at the top of the page.
 */
export default function Header() {
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
    const [show, setShow] = useState(false);
    useEffect(() => {
        if(pathname.match(/\/catalog(\/[A-Za-z0-9]+)+/g) !== null)
            setShow(true);
        else
            setShow(false);
    }, [pathname]);
    
    const [open, setOpen] = useState(false); // This keeps track of the modal state
    const [darkMode, toggleDarkMode] = useContext(DarkModeContext); // This is the dark mode context
    return (
        <section className={["header", open? "open" : "", moved? "moved" : "", show? "show" : ""].join(" ")}>
            <Link className="branding" href="/">
                <i className='urban-icons'>urbarch_logo</i>
                <div>
                    <span className="urban">urban</span>
                    <span className="archaeology">ARCHAEOLOGY</span>
                </div>
            </Link>
            <div className="menu">
                <div className="navigation">
                    <Link className={pathname === '/catalog'? "active" : ""} href="/catalog">Catalog</Link>
                    <Link className={pathname === '/salvage'? "active" : ""} href="/salvage">Salvage</Link>
                    <Link className={pathname === '/gallery'? "active" : ""} href="/gallery">Gallery</Link>
                    <IconButton className="cart" role="primary" style="text" icon='shopping_cart' />
                </div>
                <IconButton className="dark-mode" role="secondary" style="outlined" icon={darkMode? "dark_mode" : "light_mode"} onPress={toggleDarkMode} />
                <IconButton className="modal-button" role="primary" style="text" icon="menu_open" onPress={() => setOpen(true)} />
            </div>
            <div className="modal">
                <div className="scrim" onMouseDown={() => setOpen(false)} />
                <div className="navigation">
                    <div className="buttons">
                        <IconButton className="cart" role="primary" style="text" icon='shopping_cart' />
                        <IconButton className="dark-mode" role="secondary" style="outlined" icon={darkMode? "dark_mode" : "light_mode"} onPress={toggleDarkMode} />
                        <IconButton icon="close" onPress={() => setOpen(false)} />
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