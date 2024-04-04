"use client"
import Link from 'next/link';
import React from 'react';
import {createUseStyles} from "react-jss";
import Heading from './heading';
import Subheading from './subheading';

const useStyles = createUseStyles(theme => ({
    hours: {},
    location: {},
    navigation: {},
    icons: {},
    socials: {},
    links: {},
    info: {},
    copyright: {},
    terms: {},
    accredation: {},
    credits: {},
    footer: {
        width: "100%",

        backgroundColor: theme.surface,

        "& $info": {
            display: "flex",
            gap: "40px",
            padding: "20px",
            
            "& $location": {
                width: "33%",

                "& $hours": {
                    color: theme.body
                }
            },
            "& $links": {
                width: "34%",
                display: "flex",
                flexDirection: "column",
                gap: "20px",

                "& a": {
                    textDecoration: "none",
                    color: theme.body,
                },

                "& $navigation": {
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                },
                "& $socials": {
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    "& $icons": {
                        display: "flex",
                        gap: "10px",
                        "& .urban-icons": {
                            fontSize: "32px"
                        }
                    }
                }
            }
        },
        "& $credits": {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",

            backgroundColor: theme.primary,
            color: theme.onPrimary,
            "& a": {
                textDecoration: "none",
                color: theme.onSecondary
            },

            "& $accredation": {
                fontSize: "0.75rem",
                padding: "10px"
            }
        }
    }
}));

export default function Footer() {
    const styles = useStyles({});
    return (
        <section className={styles.footer}>
            <div className={styles.info}>
                <div className={styles.location}>
                    <Heading>Locations</Heading>
                    <Subheading>New York</Subheading>

                    <b className={styles.hours}>Showroom Hours</b>
                </div>
                <div className={styles.location}>
                    <Subheading>Long Island City</Subheading>
                    <Subheading>Boston and San Francisco</Subheading>
                    <Subheading>Chicago</Subheading>
                    <Subheading>Southeast</Subheading>
                </div>
                <div className={styles.links}>
                    <div className={styles.navigation}>
                        <Heading>Navigation</Heading>
                        <Link href="/">Home</Link>
                        <Link href="/catalog">Catalog</Link>
                        <Link href="/salvage">Salvage</Link>
                        <Link href="/gallery">Gallery</Link>
                    </div>
                    <div className={styles.socials}>
                        <Heading>Socials</Heading>
                        <div className={styles.icons}>
                            <Link className='urban-icons' href="https://www.facebook.com/urbanarchaeologyltd">facebook_logo</Link>
                            <Link className='urban-icons' href="https://instagram.com/urbanarchaeologyltd">instagram_logo</Link>
                            <Link className='urban-icons' href="https://pinterest.com/urbanarchltd/">pinterest_logo</Link>
                            <Link className='urban-icons' href="https://www.linkedin.com/company/urban-archaeology/">linkedin_logo</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.credits}>
                <span className={styles.copyright}>Copyright © 2012-2024 Urban Archaeology Ltd. All rights reserved.</span>
                <Link className={styles.terms} href="/terms">Terms and conditions apply.</Link>
                <span className={styles.accredation}>Designed and built by <Link href="https://github.com/ochakaru">Kalvin Garcia</Link></span>
            </div>
        </section>
    );
}