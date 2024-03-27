"use client"
import  {useState, useEffect} from 'react';

import Hero from './components/hero';

export default function Home() {
    const [tags, set_tags] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/tag").then(response => {
            return response.json();
        }).then(result => {
            const tag_list = [];
            for(const [name, category] of Object.entries(result)) {
                for(const tag of category) {
                    tag_list.push(tag.name);
                }
            }
            set_tags(tag_list);
        });
    }, []);

    return (
        <main>
            <Hero />
            <div style={{backgroundColor: "white", height: "2000px", width: "100%"}} />
        </main>
    )
}