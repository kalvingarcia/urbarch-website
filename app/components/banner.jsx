"use client";
import Image from 'next/image';
import  {useEffect, useState} from 'react';
import '../assets/styles/components/banner.scss';

export default function Banner({src, children}) {
    const [image, setImage] = useState("");
    useEffect(() => {
        (async () => {
            setImage(await import(`../assets/backgrounds/${src}`));
        })();
    }, [src]);

    return (
        <section className="banner">
            <figure className='parallax-container'>
                <Image className='parallax-image' src={image} alt="Custom banner image" />
            </figure>
            <div className='overlay' />
            <div className='content'>
                {children}
            </div>
        </section>
    );
}