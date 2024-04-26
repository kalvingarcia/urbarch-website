import {redirect} from 'next/navigation';
import Spotlight from '../../assets/components/spotlight';
import Image from 'next/image';
import {Heading, Subheading, Subtitle, Title} from '../../assets/components/typography';
import Button from '../..//assets/components/button';
import DropdownMenu from '../..//assets/components/dropdown-menu';
import '../../assets/styles/pages/product.scss';
import {GET_PRODUCTS} from '../../api';

export default async function Product({params: {product: [id, extension, ...rest]}}) {
    if(rest.length > 0)
        redirect(`/catalog/${id}/${extension}`);
    if(extension === "DEFAULT")
        redirect(`/catalog/${id}`);

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
    const productInfo = (await fetch(`${GET_PRODUCTS}/${id}`).then(response => response.json()))[0];
    const variationInfo = productInfo.variations.find(variation => variation.extension === extension);

    return (
        <main className='product'>
            <section className='info'>
                <Spotlight>
                    {images.map(image => (
                        <Image key={image.name} src={image.src} alt={image.alt} />
                    ))}
                </Spotlight>
                <div className='metadata'>
                    <Title>{productInfo.name}</Title>
                    {extension !== "DEFAULT"? <Subtitle>{variationInfo.subname}</Subtitle> : ""}
                    <Subheading>{id}{extension !== "DEFAULT"? "-" + extension : ""}</Subheading>
                    <Heading>${variationInfo.price}.00</Heading>
                    <p>{productInfo.description}</p>
                    <Button role="primary" style="filled">Product Details</Button>
                    <div>
                        <DropdownMenu name="Finishes" choices={variationInfo.overview.finishes} />
                        {Object.entries(variationInfo.overview.options).map(([name, choices]) => (
                            <DropdownMenu key={name} name={name} choices={choices} />
                        ))}
                    </div>
                </div>
            </section>
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