"use client"
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import {useState, useEffect} from 'react';
import {CardSkeleton} from './card';
import {Heading} from './typography';
import useRippleEffect from '../hooks/ripple';
import IconButton from './icon-button';
import '../styles/components/customs.scss';

export function Custom({id, productID, extension, name, customer, category}) {
    const [rippleExpand, rippleFade] = useRippleEffect();
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState("");

    useEffect(() => {
        (async () => {
            setLoading(true);
            setImage(await import(`../images/${from}/${id}/card.jpg`));
            setLoading(false);
        })();
    }, [])

    const router = useRouter();
    return (loading?
        <CardSkeleton type="small" />
        :
        <div 
            className={['card', type].join(" ")} 
            onMouseDown={rippleExpand} onMouseUp={rippleFade}
            onClick={() => setTimeout(() => router.push(`/custom/${id}`), 100)}
        >
            <div className='image'>
                <Image src={image} alt="" />
            </div>
            <div className='content'>
                <div className='metadata'>
                    <span className='name'>{name}{customer !== ''? ` [${customer}]` : ''}</span>
                    <span className='category'>{category}</span>
                </div>
                <span className='uaid'>{productID}{extension !== 'DEFAULT'? `-${extension}` : ''}</span>
            </div>
        </div>
    );
}

function GalleryLink() {
    const [rippleExpand, rippleFade] = useRippleEffect();
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState("");

    useEffect(() => {
        (async () => {
            setLoading(true);
            setImage(await import(`../images/backgrounds/custom.png`));
            setLoading(false);
        })();
    }, [])

    const router = useRouter();
    return (loading?
        <CardSkeleton type="small" />
        :
        <div 
            className='gallery-link'
            onMouseDown={rippleExpand} onMouseUp={rippleFade} 
            onClick={() => setTimeout(() => router.push(`/custom`), 100)}
        >
            <Image src={image} alt="" />
            <div className='overlay' />
            <div className='content'>
                <span>See other ideas we've brought to life!</span>
                <IconButton className="go" role="secondary" style="outlined" icon="arrow_forward" />
            </div>
        </div>
    );
}

export default function Customs({children}) {
    return (
        <section className="customs">
            <Heading>Customs Gallery</Heading>
            <div className="cards">
                {children}
                <GalleryLink />
            </div>
        </section>
    );
}