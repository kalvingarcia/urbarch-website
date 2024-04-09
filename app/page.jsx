import Hero from './components/hero';
import Card from './components/card';

export default function Home() {
    return (
        <main>
            <Hero src="../assets/backgrounds/home.png"/>
            <div>
                <Card name="Banded Beacon [Small]" category="Lighting" price="$300" uaid="UA0000" />
                <Card type="small" name="Banded Beacon [Small]" category="Lighting" price="$300" uaid="UA0000" />
                <Card type="list" name="Banded Beacon [Small]" category="Lighting" price="$300" uaid="UA0000" />
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