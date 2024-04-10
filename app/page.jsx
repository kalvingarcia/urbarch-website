"use client"
import {useEffect, useState} from 'react';
import Hero from './components/hero';
import Card from './components/card';
import Display from './components/display';
import Button from './components/button';
import useWindowSize from './hooks/window';

export default function Home() {
    const [listView, setListView] = useState(false);
    const {width} = useWindowSize();
    useEffect(() => {
        setListView(false);
        if(width < 800)
            setListView(true);
    }, [width]);

    return (
        <main>
            <Hero>
                <Display size="medium" style={{fontFamily: "var(--cinzel)"}}>An Exploration of</Display>
                <Display>urban <span style={{fontFamily: "var(--cinzel)"}}>ARCHAEOLOGY</span></Display>
                <Display size="small">May 16th-17th and 20th-23rd </Display>
                <Display size="small">@ 7:00 AM - 4:00 PM</Display>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSdL1pVylvGkvPjGTv31c1-C0y_04Xfp3KzbrWaPNWAe2u-SJg/viewform"><Button role="secondary" style="outlined">RSVP Here!</Button></a>
            </Hero>
            <div>
                
                <Card type={listView? "list" : "normal"} name="Banded Beacon [Small]" category="Lighting" price="$300" uaid="UA0000" />
            </div>
        </main>
    );
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