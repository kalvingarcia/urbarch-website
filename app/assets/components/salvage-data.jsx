"use client"
import {Heading, Subtitle, Title} from './typography';
import Button from './button';
import DropdownMenu from './dropdown-menu';
import FinishesMenu from './finishes-menu';
import '../styles/components/metadata.scss';

export default function ProductData({salvage, serial}) {
    const item = salvage.items.find(item => item.serial.toString() === serial);

    return (
        <div className='metadata'>
            <div className='general'>
                <div className='title'>
                    <Title>{salvage.name}</Title>
                    <Subtitle>{item.serial}</Subtitle>
                </div>
                <span className='id'>{salvage.id}-{serial}</span>
                <span className='price'>{item.price === 0? 'Call for pricing' : `$${item.price}.00`}</span>
                <p className='description'>{salvage.description}</p>
                <Button role="primary" style="filled">Salvage Details</Button>
            </div>
        </div>
    );
}