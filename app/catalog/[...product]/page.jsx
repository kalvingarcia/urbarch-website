import {notFound, redirect} from 'next/navigation';
import Image from 'next/image';
import Spotlight from '../../assets/components/spotlight';
import ProductData from '@/app/assets/components/product-data';
import Variations, {Variation} from '@/app/assets/components/variations';
import Related from '../../assets/components/related';
import Customs from '@/app/assets/components/customs';
import Card from '@/app/assets/components/card';
import '../../assets/styles/pages/product.scss';
import {GET_PRODUCTS, GET_RELATED_PRODUCTS, GET_RELATED_CUSTOMS} from '../../api';

export async function generateMetadata({params}) {
    const {product: [id, extension, ..._]} = await params;
    const product = (await fetch(`${GET_PRODUCTS}/${id}`).then(response => {
        if(!response.ok) {
            extension = undefined;
            if(response.status === 404)
                return {name: "404 Not Found"};
            else
                return {name: "An error occured"};
        }
        return response.json();
    }));

    if(!extension)
        extension = "DEFAULT";
    const variation = product.variations?.find(variation => variation.extension === extension);

    return {
        title: `Urban Archaeology | ${product.name}${extension !== "DEFAULT"? ` [${variation.subname}]` : ""} Product Page`,
        description: product.description
    };
}

export default async function Product({params}) {
    const {product: [id, extension, ...rest]} = await params;
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
    const drawing = (await import(`../../assets/images/products/${id}/${extension}/drawing.jpg`).catch(() => undefined))?.default

    const product = (await fetch(`${GET_PRODUCTS}/${id}`, {cache: 'no-store'}).then(response => {
        if(!response.ok)
            if(response.status === 404) 
                return notFound();
            else 
                throw new Error("An error occured while attempting to get the product data.");
        return response.json()
    }));
    if(!product)
        throw new Error("An error occured while attempting to get the product data.");
    const related = await fetch(`${GET_RELATED_PRODUCTS}?id=${id}&extension=${extension}`, {cache: 'no-store'}).then(response => response.json());
    const customs = await fetch(`${GET_RELATED_CUSTOMS}?id=${id}&extension=${extension}`).then(response => response.json());
    return (
        <main className='product'>
            <section className='info'>
                <Spotlight>
                    {images.map(image => (
                        <Image key={image.name} src={image.src} alt={image.alt} />
                    ))}
                </Spotlight>
                <div className='data'>
                    <ProductData product={product} extension={extension} drawing={drawing} />
                    {product.variations.length !== 1?
                        <Variations>
                            {product.variations.map(variation => (
                                <Variation
                                    key={variation.extension}
                                    from="products"
                                    active={extension === variation.extension}
                                    id={product.id}
                                    extension={variation.extension}
                                    name={product.name}
                                    subname={variation.subname}
                                    price={variation.finishes.reduce((min, {value}) => min < value? min : value, Infinity)}
                                />
                            ))}
                        </Variations>
                        :
                        ""
                    }
                </div>
            </section>
            {related.length > 0?
                <Related>
                    {related.map(product => (
                        <Card 
                            key={`${product.id}${product.extension !== 'DEFAULT'? `-${product.extension}` : ""}}`}
                            type="small"
                            from='products'
                            id={product.id}
                            extension={product.extension}
                            name={product.name}
                            subname={product.subname}
                            category={product.category}
                        />
                    ))}
                </Related>
                :
                ""
            }
            <Customs>
                {customs.map(item => (
                    <Custom
                        key={item.id}
                        id={item.id}
                        productID={item.product_id}
                        extension={item.variation_extension}
                        name={item.name}
                        customer={item.subname}
                        category={product.category}
                    />
                ))}
            </Customs>
        </main>
    );
}