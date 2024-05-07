"use client"
import {useRouter} from 'next/navigation';
import {Heading} from './typography';
import useRippleEffect from '../hooks/ripple';
import '../styles/components/variations.scss';

export function Variation({from, active, id, extension, name, subname, price}) {
    const router = useRouter();
    const [rippleExpand, rippleFade] = useRippleEffect();
    return (
        <div 
            className={['variation', active? "active" : ""].join(" ")} 
            onMouseDown={rippleExpand} onMouseUp={rippleFade} 
            onClick={() => setTimeout(() => router.push(`/${from === 'products'? 'catalog' : 'salvage'}/${id}/${from === 'products'? extension : 1}`), 100)}
        >
            <span className='name'>{name}{subname !== "DEFAULT"? ` [${subname}]` : ""}</span>
            <span className='id'>{id}{extension !== "DEFAULT"? "-" + extension : ""}</span>
            <span className='price'>{price === 0? "Call for pricing" : `$${price}`}</span>
        </div>
    );
}

export default function Variations({children}) {
    return (
        <div className='variations'>
            <Heading>Variations</Heading>
            <div className='links'>
                {children}
            </div>
        </div>
    )
}