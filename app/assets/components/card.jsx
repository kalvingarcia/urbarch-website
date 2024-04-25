"use client"
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {useEffect, useState} from 'react';
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

export default function Card({type = "normal", from, name, category, price, id, extension}) {
    const [rippleExpand, rippleFade] = useRippleEffect();
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState("");

    useEffect(() => {
        (async () => {
            setLoading(true);
            setImage(await import(`../images/${from}/${id}.jpg`));
            setLoading(false);
        })();
    }, [])

    const router = useRouter();
    return (loading?
        <CardSkeleton type={type} />
        :
        <div className={['card', type].join(" ")} onMouseDown={rippleExpand} onMouseUp={rippleFade} onClick={() => router.push(`/catalog/${id}/${extension}`)}>
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