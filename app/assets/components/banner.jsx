"use client";
import Image from 'next/image';
import  {useEffect, useState} from 'react';
import '../styles/components/banner.scss';

export default function Banner({src, children}) {
    const [image, setImage] = useState(null);
    useEffect(() => {
        (async () => {
            setImage((await import(`../images/backgrounds/${src}`)).default);
        })();
    }, [src]);

    return (
        <section className="banner">
            <figure className='parallax-container'>
                {image && <Image className='parallax-image' src={image} alt="Banner image" />}
            </figure>
            <div className='overlay' />
            <div className='content'>
                {children}
            </div>
        </section>
    );
}