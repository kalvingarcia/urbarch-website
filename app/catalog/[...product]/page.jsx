import {redirect} from 'next/navigation';
import Spotlight from '@/app/assets/components/spotlight';
import Image from 'next/image';
import {Heading, Title} from '@/app/assets/components/typography';
import Button from '@/app/assets/components/button';

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
            src: (await import(`../../assets/images/products/${id}/${extension}/${count}.jpg`).catch(() => undefined))?.default
        };
        if(image.src === undefined)
            break;
        images.push(image);
        count++;
    }
    console.log(images);
    
    return (
        <main style={{height: "2000px"}}>
            <Spotlight>
            {images.map(image => (
                <Image key={image.name} src={image.src} />
            ))}
            </Spotlight>
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