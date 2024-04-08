"use client"
import Hero from './components/hero';
import Button from './components/button';

export default function Home() {
    return (
        <main>
            <Hero />
            <div style={{height: "400px"}}>
                <Button role="primary" style="filled">Contact Us</Button>
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