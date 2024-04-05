"use client"
import Link from 'next/link';
import React from 'react';
import {createUseStyles} from "react-jss";
import Heading from './heading';
import Subheading from './subheading';
import Button from './button';

const useStyles = createUseStyles(theme => ({
    location: {},
    divider: {},
    locations: {},
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
        color: theme.body,

        "& $info": {
            display: "flex",
            gap: "40px",
            padding: "20px",
            
            "& $locations": {
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                width: "33%",

                "& $location": {
                    display: "flex",
                    flexDirection: "column"
                },
                "& $divider": {
                    height: "1pt",
                    width: "66%",
                    alignSelf: "center",
                    backgroundColor: theme.body,
                    opacity: 0.5
                },
                "@media (max-width: 800px)": {
                    display: "none"
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
                    gap: "10px",
                    "@media (max-width: 800px)": {
                        width: "50%"
                    }
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
                    },
                    "@media (max-width: 800px)": {
                        width: "50%"
                    }
                },
                "@media (max-width: 800px)": {
                    width: "100%",
                    flexDirection: "row"
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
                <div className={styles.locations}>
                    <Heading>Locations</Heading>
                    <div className={styles.location}>
                        <Subheading>New York</Subheading>
                        <span>156 Franklin Street, New York, NY 10013</span>
                        <span>Phone: (212) 371-4646</span>
                        <span>Fax: (212) 371-1601</span>
                        <Link href="ny@urbanarchaeology.com">ny@urbanarchaeology.com</Link>
                    </div>
                    <div className={styles.location}>
                        <b>Showroom Hours</b>
                        <span>Monday-Friday: 8:00 AM to 5:00 PM</span>
                        <span>Saturday and Sunday: Closed</span>
                        {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.939308536255!2d-74.01069595827086!3d40.7193525372826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258e5d67c4c2b%3A0xecfd9b6a06dfc53!2sUrban%20Archaeology!5e0!3m2!1sen!2sus!4v1712259752936!5m2!1sen!2sus"
                            style={{border: 0}}
                            allowfullscreen=""
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                        /> */}
                    </div>
                </div>
                <div className={styles.locations}>
                    <div className={styles.location}>
                        <Subheading>Long Island City</Subheading>
                        <span>43-34 32nd Place, 2R Long Island City, NY 11101</span>
                        <span>Phone: (212) 413-4646</span>
                        <span>Fax: (212) 334-4659</span>
                        <Link href="gil@urbanarchaeology.com">gil@urbanarchaeology.com</Link>
                    </div>
                    <div className={styles.divider} />
                    <div className={styles.location}>
                        <Subheading>Boston and San Francisco</Subheading>
                        <span>Phone: (617) 737-4646</span>
                        <span>Fax: (617) 737 6699</span>
                        <Link href="mary@urbanarchaeology.com">mary@urbanarchaeology.com</Link>
                    </div>
                    <div className={styles.location}>
                        <Subheading>Chicago</Subheading>
                        <span>Phone: (312) 371 2249</span>
                        <Link href="melissa@urbanarchaeology.com">melissa@urbanarchaeology.com</Link>
                    </div>
                    <div className={styles.location}>
                        <Subheading>Southeast</Subheading>
                        <span>Phone: (917) 685-6113</span>
                        <Link href="adrienne@urbanarchaeology.com">adrienne@urbanarchaeology.com</Link>
                    </div>
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
                        <Button className={styles.contact} role="primary" style="filled" onPress={() => setOpen(true)}>Contact Us</Button>
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