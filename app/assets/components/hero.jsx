"use client";
import Image from 'next/image';
import  {useCallback, useEffect, useState} from 'react';
import IconButton from './icon-button';
import '../styles/components/hero.scss';

export default function Hero({src, children}) {
    const [image, setImage] = useState(null);
    useEffect(() => {
        (async () => {
            setImage((await import(`../images/backgrounds/${src}`)).default);
        })();
    }, [src]);

    // Here we have a callback for showing the hero content on mouse move
    const [hide, setHide] = useState(true);
    const unhide = useCallback(() => {
        setHide(false); // We unhide the hero's content
    }, []);

    return (
        <section className={['hero', hide? "hide" : ""].join(" ")} onMouseMove={() => unhide()}>
            <figure className='parallax-container'>
                {image && <Image className='parallax-image' src={image} alt="Hompage background image" />}
            </figure>
            <div className='overlay' />
            <div className='content'>
                {children}
            </div>
            <div className='visibility'>
                <IconButton role="secondary" style="outlined" icon={hide? "visibility" : "visibility_off"} onPress={() => setHide(!hide)}/>
            </div>
        </section>
    );
}
