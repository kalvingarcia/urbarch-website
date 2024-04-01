import {Cinzel} from 'next/font/google';
import Link from 'next/link';
import React from 'react';
import {createUseStyles} from 'react-jss';

const cinzel = Cinzel({
    subsets: ['latin']
});

const useStyles = createUseStyles({
    header: {
        // This is the styling to keep the header formatted in an appealing way
        width: "100%",
        padding: "20px",

        // This is the styling to make the header stay at the top of the screen
        display: "flex",
        justifyContent: "space-between",
        position: "fixed",
        top: 0,
        zIndex: 100,

        "& a": {
            textDecoration: "none",
            "&:link, &:visited": {
                color: ({hovered, moved}) => hovered || moved? "black" : "white"
            }
        }
    },
    branding: {
        display: "flex",
        alignItems: "center",
        textDecoration: "none"
    },
    navigation: {
        listStyle: "none outside none",
        display: "flex",
        alignItems: "center",
        "& a": {
            fontSize: "1.25rem",
            padding: "0px 20px"
        }
    }
});

export default function Header() {

    const styles = useStyles({hovered: false, moved: false});
    return (
        <section className={styles.header}>
            <Link className={styles.branding} href="/">
                <span className='material-icons'>home</span>
                <span className={styles.urban}>urban</span>
                <span className={`${styles.archaeology} ${cinzel.className}`}>ARCHAEOLOGY</span>
            </Link>
            <ul className={styles.navigation}>
                <li><Link href="https://youtube.com">Catalog</Link></li>
                <li><Link href="https://x.com">Gallery</Link></li>
                <li><Link className='material-icons' href="https://amazon.com">shopping_cart</Link></li>
            </ul>
        </section>
    );
}