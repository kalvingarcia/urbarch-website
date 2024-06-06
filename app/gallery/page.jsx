import Banner from "../assets/components/banner";
import {Display} from "../assets/components/typography";
import Portfolio, {Piece} from "../assets/components/portfolio";

export default async function Gallery({searchParams}) {
    const customs = await fetch().then();
    return (
        <main>
            <Banner src="gallery.jpg">
                <Display size="medium">Gallery</Display>
            </Banner>
            <Portfolio>
                {customs.map(custom => (
                    <Piece 
                        key={custom.id} 
                        id={custom.id}
                        name={custom.name}
                        description={custom.description}
                        customer={custom.customer}
                        product={custom.product}
                    />
                ))}
            </Portfolio>
        </main>
    );
}