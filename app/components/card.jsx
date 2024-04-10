"use client"
import Image from 'next/image';
import {useEffect, useState} from 'react';
import useRippleEffect from '../hooks/ripple';
import '../assets/styles/components/card.scss';

export default function Card({type = "normal", name, category, price, uaid}) {
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState("");
    useEffect(() => {
        (async () => {
            setLoading(true);
            setImage(await import(`../assets/products/${uaid}.jpg`));
            setLoading(false);
        })();
    }, [uaid]);

    const [rippleExpand, rippleFade] = useRippleEffect();
    return (
        <div className={['card', type].join(" ")} onMouseDown={rippleExpand} onMouseUp={rippleFade}>
            <div className='image'>
                <Image src={image} alt="" />
            </div>
            <div className='content'>
                <div className='metadata'>
                    <span className='name'>{name}</span>
                    <span className='categrpy'>{category}</span>
                    <span className='price'>{price}</span>
                </div>
                <span className='uaid'>{uaid}</span>
            </div>
        </div>
    );
}