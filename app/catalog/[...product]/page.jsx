import {redirect} from 'next/navigation';
import Image from 'next/image';
import Spotlight from '../../assets/components/spotlight';
import Metadata from '@/app/assets/components/metadata';
import Variations, {Variation} from '@/app/assets/components/variations';
import Related from '../../assets/components/related';
import '../../assets/styles/pages/product.scss';
import {GET_PRODUCTS} from '../../api';

export async function generateMetadata({params: {product: [id, extension, ...rest]}}, parent) {
    const product = (await fetch(`${GET_PRODUCTS}/${id}`).then(response => response.json()))[0];
    const variation = product.variations.find(variation => variation.extension === extension);
    const parentTitle = (await parent).title.absolute || "";

    return {
        title: `${parentTitle} | ${product.name}${extension !== "DEFAULT"? ` [${variation.subname}]` : ""}`,
        description: product.description,
        openGraph: {
            title: `${product.name}${extension !== "DEFAULT"? ` [${variation.subname}]` : ""}`,
            description: product.description,
            siteName: "Urban Archaeology"
        }
    };
}

export default async function Product({params: {product: [id, extension, ...rest]}}) {
    if(rest.length > 0)
        redirect(`/catalog/${id}/${extension}`);
    if(!extension)
        extension = "DEFAULT";

    let count = 0;
    const images = [];
    while(true) {
        const image = {
            name: `${count}.jpg`,
            alt: `Product image ${count}`,
            src: (await import(`../../assets/images/products/${id}/${extension}/${count}.jpg`).catch(() => undefined))?.default
        };
        if(image.src === undefined)
            break;
        images.push(image);
        count++;
    }

    const product = (await fetch(`${GET_PRODUCTS}/${id}`).then(response => response.json()))[0];
    return (
        <main className='product'>
            <section className='info'>
                <Spotlight>
                    {images.map(image => (
                        <Image key={image.name} src={image.src} alt={image.alt} />
                    ))}
                </Spotlight>
                <div className='data'>
                    <Metadata product={product} extension={extension} />
                    <Variations>
                        {product.variations.map(variation => (
                            <Variation
                                key={variation.extension}
                                active={extension === variation.extension}
                                id={product.id}
                                extension={variation.extension}
                                name={product.name}
                                subname={variation.subname}
                                price={variation.price}
                            />
                        ))}    
                    </Variations>
                </div>
            </section>
            <Related id={id} extension={extension} />
        </main>
    );
}

/* 
<section>
    <Slideshow>
        {images.map(image => (
            <Image />
        ))}
    </Slideshow>
    <div>
        <Title>{}</Title>
        <span>{}</span>
        <Heading>{}</Heading>
        <p>{}</p>
        <Button>Product Details</Button>
        <div>
            {options.map(option => (
                <DropdownMenu key={option.name} name={option.name}>
                    {option.choices.map(choice => <Option></Option>)}
                </DropdownMenu>
            ))}
        </div>
    </div>
</section>
<RelatedProducts id={id} extension={extension} />
<CustomGallery id={id} extension={extension} /> 
*/