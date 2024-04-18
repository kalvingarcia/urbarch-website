"use client"
import Image from 'next/image';
import {Suspense} from 'react';
import useRippleEffect from '../hooks/ripple';
import '../styles/components/card.scss';

export function CardSkeleton({type = "normal"}) {
    return (
        <div className={['card', type, "skeleton"].join(" ")}>
            <div className='image' />
            <div className='content'>
                <div className='metadata'>
                    <div className='name' />
                    <div className='category' />
                    <div className='price' />
                </div>
                <div className='uaid' />
            </div>
        </div>
    );
}

async function AsyncCard({type = "normal", name, category, price, id, rippleExpand, rippleFade}) {
    const image = await import(`../images/products/${id}.jpg`);
    return (
        <div className={['card', type].join(" ")} onMouseDown={rippleExpand} onMouseUp={rippleFade}>
            <div className='image'>
                <Image src={image} alt="" />
            </div>
            <div className='content'>
                <div className='metadata'>
                    <span className='name'>{name}</span>
                    <span className='category'>{category}</span>
                    <span className='price'>${price}</span>
                </div>
                <span className='uaid'>{id}</span>
            </div>
        </div>
    );
}

export default function Card({...props}) {
    const [rippleExpand, rippleFade] = useRippleEffect();
    return (
        <Suspense fallback={<CardSkeleton type={props.type} />}>
            <AsyncCard {...props} rippleExpand={rippleExpand} rippleFade={rippleFade} />
        </Suspense>
    );
}