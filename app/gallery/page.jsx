import Banner from "../assets/components/banner";
import {Display} from "../assets/components/typography";
import Portfolio, {Piece} from "../assets/components/portfolio";
import {GET_CUSTOMS} from "../api";
import {useCallback} from "react";

export default async function Gallery({searchParams}) {
    let offset = searchParams.offset? searchParams.offset : 0;
    const customs = await fetch(`${GET_CUSTOMS}?${offset}`).then(response => response.json());
    const addNextCustoms = async () => {
        offset += 10;
        customs.concat(await fetch(`${GET_CUSTOMS}?${offset}`).then(response => response.json()));
    };

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