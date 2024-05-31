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
                <span className='price'>{price === 0? "Call for pricing" : `$${price}.00`}</span>
                <p className='description'>{product.description}</p>
                <Button role="primary" style="filled" onPress={() => setOpen(true)}>Product Details</Button>
            </div>
            <div className='options'>
                <Heading>Options</Heading>
                {variation.overview.finishes.length !== 0?
                    <FinishesMenu choices={variation.overview.finishes} onChange={onPriceChange} />
                    :
                    ""
                }
                {Object.entries(variation.overview.options).map(([name, choices]) => (
                    <DropdownMenu key={name} name={name} choices={choices} onChange={onPriceChange} />
                ))}
            </div>
            <div className={['modal', open? 'open' : ''].join(" ")}>
                <div className='scrim' onClick={() => setOpen(false)} />
                <div className='overview'>
                    <div>
                        <Heading>Drawing</Heading>
                        <Image src={drawing} alt="" />
                    </div>
                        <div>
                        <Heading>Overview</Heading>
                        {variation.overview.specifications?
                            <div className='specifications'>
                                <Subheading>Specifications</Subheading>
                                <span>Height: {variation.overview.specifications.height.measurement} {variation.overview.specifications.height.unit}</span>
                                <span>Width: {variation.overview.specifications.width.measurement} {variation.overview.specifications.width.unit}</span>
                                <span>Depth: {variation.overview.specifications.depth.measurement} {variation.overview.specifications.depth.unit}</span>
                                <span>Weight: {variation.overview.specifications.weight.measurement} {variation.overview.specifications.weight.unit}</span>
                            </div>
                            :
                            ""
                        }
                        {variation.overview.ul.length > 0?
                            <div className='ul-info'>
                                <Subheading>UL Listing</Subheading>
                                <span>This product is listed for use in {variation.overview.ul[0].toUpperCase()} environments.</span>
                            </div>
                            :
                            ""
                        }
                        {variation.overview.bulb.quantity > 0?
                            <div>
                                <Subheading>Bulb Information</Subheading>
                                <span>{variation.overview.bulb.shape.name} Bulb ({variation.overview.bulb.shape.code})</span>
                                <span>{variation.overview.bulb.socket.name} Base ({variation.overview.bulb.socket.code})</span> 
                                <span>{variation.overview.bulb.specifications} LED recommended</span>
                                <span>{variation.overview.bulb.quantity} count</span>
                            </div>
                            :
                            ""
                        }
                        {variation.replacements.length > 0?
                            <div className='replacements'>
                                <Subheading>Replacements</Subheading>
                                <div className='list'>
                                    {variation.replacements.map(replacement =>(
                                        <a key={`${replacement.id}-${replacement.extension}`} className="replacement">
                                            <span>{replacement.name}{replacement.subname === "DEFAULT"? "" : ` [${replacement.subname}]`}</span>
                                            <span>{replacement.id}{replacement.extension === "DEFAULT"? "" : ` -${replacement.extension}`}</span>
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
        </div>
    );
}