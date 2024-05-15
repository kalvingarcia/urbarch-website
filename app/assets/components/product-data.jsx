"use client"
import Image from 'next/image';
import {useState} from 'react';
import {Heading, Subheading, Subtitle, Title} from './typography';
import Button from './button';
import DropdownMenu from './dropdown-menu';
import FinishesMenu from './finishes-menu';
import usePriceChange from '../hooks/price-change';
import '../styles/components/metadata.scss';

export default function ProductData({product, extension, drawing}) {
    const variation = product.variations.find(variation => variation.extension === extension);
    const [price, onPriceChange] = usePriceChange(variation.price);

    const [open, setOpen] = useState(false);
    return (
        <div className='metadata'>
            <div className='general'>
                <div className='title'>
                    <Title>{product.name}</Title>
                    {extension !== "DEFAULT"? <Subtitle>{variation.subname}</Subtitle> : ""}
                </div>
                <span className='id'>{product.id}{extension !== "DEFAULT"? "-" + extension : ""}</span>
                <span className='price'>${price}.00</span>
                <p className='description'>{product.description}</p>
                <Button role="primary" style="filled" onPress={() => setOpen(true)}>Product Details</Button>
            </div>
            <div className='options'>
                <Heading>Options</Heading>
                <FinishesMenu choices={variation.overview.finishes} onChange={onPriceChange} />
                {Object.entries(variation.overview.options).map(([name, choices]) => (
                    <DropdownMenu key={name} name={name} choices={choices} onChange={onPriceChange} />
                ))}
            </div>
            <div className={['modal', open? 'open' : ''].join(" ")}>
                <div className='scrim' onClick={() => setOpen(false)} />
                <div className='overview'>
                    <Image src={drawing} alt="" />
                    <Heading>Product Overview</Heading>
                    {variation.overview.specifications?
                        <div className='specifications'>
                            <Subheading>Specifications</Subheading>
                            <span>Height: {variation.overview.specifications.height}</span>
                            <span>Width: {variation.overview.specifications.width}</span>
                            <span>Depth: {variation.overview.specifications.depth}</span>
                            <span>Weight: {variation.overview.specifications.weight}</span>
                        </div>
                        :
                        ""
                    }
                    {variation.overview.ul_info.length > 0?
                        <div className='ul-info'>
                            <Subheading>UL Listing</Subheading>
                            <span>This product is listed for use in {variation.overview.ul_info[0].toUpperCase()} environments.</span>
                        </div>
                        :
                        ""
                    }
                    {variation.replacements?
                        <div className='replacements'>
                            <Subheading>Replacements</Subheading>
                            <div className='list'>
                                {variation.replacements.map(replacement =>(
                                    <a className="replacement">
                                        <span>{replacement.name}</span>
                                        <span>{replacement.id}</span>
                                        <span>${replacement.price}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                        :
                        ""
                    }
                    {variation.overview.notes !== ''?
                        <div className='notes'>
                            <Subheading>Notes</Subheading>
                            <span>{variation.overview.notes}</span>
                        </div> 
                        :
                        ""
                    }
                </div>
            </div>
        </div>
    );
}