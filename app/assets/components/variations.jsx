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
            onClick={() => setTimeout(() => router.push(`/${from === 'products'? 'catalog' : 'salvage'}/${id}/${extension}`), 100)}
        >
            <span className='name'>{name}{subname !== ""? ` [${subname}]` : ""}</span>
            <span className='id'>{id}{extension !== "NONE"? "-" + extension : ""}</span>
            <span className='price'>{price.toString() === "Infinity"? "Call for pricing" : `From $${price.toLocaleString('en', {useGrouping: true})}`}</span>
        </div>
    );
}

export default function Variations({from = "products", children}) {
    return (
        <div className='variations'>
            <Heading>{from === "products"? "Variations" : "Items"}</Heading>
            <div className='links'>
                {children}
            </div>
        </div>
    )
}