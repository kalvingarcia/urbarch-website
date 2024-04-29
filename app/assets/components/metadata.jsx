"use client"
import {Heading, Subtitle, Title} from './typography';
import Button from './button';
import DropdownMenu from './dropdown-menu';
import FinishesMenu from '../../assets/components/finishes-menu';
import usePriceChange from '../hooks/price-change';
import '../styles/components/metadata.scss';

export default function Metadata({product, extension}) {
    const variation = product.variations.find(variation => variation.extension === extension);
    const [price, onPriceChange] = usePriceChange(variation.price);

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
                <Button role="primary" style="filled">Product Details</Button>
            </div>
            <div className='options'>
                <Heading>Options</Heading>
                <FinishesMenu choices={variation.overview.finishes} onChange={onPriceChange} />
                {Object.entries(variation.overview.options).map(([name, choices]) => (
                    <DropdownMenu key={name} name={name} choices={choices} onChange={onPriceChange} />
                ))}
            </div>
        </div>
    );
}