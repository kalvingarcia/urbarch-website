import {redirect} from 'next/navigation';
import Image from 'next/image';
import Spotlight from '../../assets/components/spotlight';
import SalvageData from '@/app/assets/components/salvage-data';
import Variations, {Variation} from '@/app/assets/components/variations';
import Related from '../../assets/components/related';
import Customs from '@/app/assets/components/customs';
import Card from '@/app/assets/components/card';
import '../../assets/styles/pages/product.scss';
import {GET_SALVAGE, GET_RELATED_SALVAGE} from '../../api';

export async function generateMetadata({params: {product: [id, serial, ...rest]}}) {
    const salvage = (await fetch(`${GET_SALVAGE}/${id}`).then(response => response.json()))[0];

    return {
        title: `Urban Archaeology | ${salvage.name} Salvage Page`,
        description: salvage.description
    };
}

export default async function Product({params: {product: [id, serial, ...rest]}}) {
    if(rest.length > 0)
        redirect(`/catalog/${id}/${extension}`);
    if(!serial)
        serial = "1";

    let count = 0;
    const images = [];
    while(true) {
        const image = {
            name: `${count}.jpg`,
            alt: `Product image ${count}`,
            src: (await import(`../../assets/images/salvage/${id}/${serial}/${count}.jpg`).catch(() => undefined))?.default
        };
        if(image.src === undefined)
            break;
        images.push(image);
        count++;
    }

    const salvage = (await fetch(`${GET_SALVAGE}/${id}`).then(response => response.json()))[0];
    const related = await fetch(`${GET_RELATED_SALVAGE}?id=${id}&serial=${serial}`, {cache: 'no-store'}).then(response => response.json());
    return (
        <main className='product'>
            <section className='info'>
                <Spotlight>
                    {images.map(image => (
                        <Image key={image.name} src={image.src} alt={image.alt} />
                    ))}
                </Spotlight>
                <div className='data'>
                    <SalvageData salvage={salvage} serial={serial} />
                    {salvage.items.length > 1?
                        <Variations from="salvage">
                            {salvage.items.map(item => (
                                <Variation
                                    key={item.serial}
                                    from="salvage"
                                    active={serial === item.serial.toString()}
                                    id={salvage.id}
                                    extension={item.serial}
                                    name={salvage.name}
                                    subname={item.serial}
                                    price={item.price}
                                />
                            ))}
                        </Variations>
                        :
                        ""
                    }
                </div>
            </section>
            <Related>
                {related.map(salvage => (
                    <Card 
                        key={salvage.id}
                        type="small"
                        from='salvage'
                        id={salvage.id}
                        name={salvage.name}
                        category={salvage.category}
                    />
                ))}
            </Related>
        </main>
    );
}